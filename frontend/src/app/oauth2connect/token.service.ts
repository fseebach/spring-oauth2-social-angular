import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/timeout"
import { environment } from '../../environments/environment';

import * as jwtDecode from 'jwt-decode';

@Injectable()
export class TokenService {

  private token$: BehaviorSubject<Token> = new BehaviorSubject<Token>(null);
  private expireSeconds$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  private iframe;

  constructor() {
    this.token.subscribe(t => {
      if (t !== null) {
        this.setupExpireTime(t);
        console.log(t.decodedAccessToken);
      }
    });

    this.iframe = document.createElement('iframe');
    this.iframe.style.width = '0px';
    this.iframe.style.height = '0px';
    this.iframe.style.border = '0'
    document.body.appendChild(this.iframe);

    this.refreshIframe().subscribe(t => this.nextToken(t), e => this.nextToken(null));

  }

  public nextToken(token: String) {
    this.token$.next(this.extractToken(token));
  }

  private setupExpireTime(token: Token) {
    setTimeout(() => {
      const diff = this.diffInSecondsForExp(token.decodedAccessToken.exp);
      if (diff < 30 || token === null) {
        this.refreshIframe().subscribe(t => this.nextToken(t), e => this.nextToken(null));
        return;
      }
      this.expireSeconds$.next(diff);
      this.setupExpireTime(this.token$.getValue());
    }, 1000);
  }

  private refreshIframe() {

    let observable = new Observable<String>(obs => {
      
      let evListener = ev => {
        if (!ev.data.token) {
          return;
        } else {
          obs.next(ev.data.token);
        }
        window.removeEventListener('message', evListener)
        obs.complete();
      }

      window.addEventListener('message', evListener)
      
      const authServerUrl = environment.authUrl + '/oauth/authorize';
      const redirectUrl = window.location.origin + `/assets/iframeauth-${environment.iframeAuth}.html`;
      const queryParams = new URLSearchParams();
      queryParams.set('response_type', 'token');
      queryParams.set('client_id', 'acme');
      queryParams.set('redirect_uri', redirectUrl);
      queryParams.set('scope', 'read write');
      // queryParams.set('state', 'blablubb'); // use random value here...
      const url = authServerUrl + '?' + queryParams.toString();

      this.iframe.setAttribute('src', url);
      
    })

    return observable
      .timeout(4000)
  }

  private extractToken(fragment) {
    if (fragment === null || fragment === undefined || fragment === '') { return null; }

    const params = fragment.split('&');
    const pairs = params.map(p => p.split('='));

    const token = new Token();
    token.access_token = pairs.find(p => p[0] === 'access_token')[1];
    token.token_type = pairs.find(p => p[0] === 'token_type')[1];
    token.expires_in = pairs.find(p => p[0] === 'expires_in')[1];
    // token.state = pairs.find(p => p[0] === 'state')[1];
    token.jti = pairs.find(p => p[0] === 'jti')  [1];
    return token;

  }

  private diffInSecondsForExp(exp: number): number {
    return (new Date(exp * 1000).getTime() - new Date().getTime()) / 1000;
  }

  get token(): Observable<Token> {
    return this.token$.asObservable();
  }

  get expireSeconds(): Observable<number> {
    return this.expireSeconds$.asObservable();
  }

}


export interface AccessToken {
  user_name: string;
  exp: number;
  authorities: string[];
  scope: string[];
}

export class Token {
  access_token: string;
  token_type: string;
  expires_in: number;
  jti: string;
  state: string;

  get decodedAccessToken(): AccessToken {
    return <AccessToken>jwtDecode(this.access_token);
  }
}