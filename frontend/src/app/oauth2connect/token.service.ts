import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/timeout"
import "rxjs/add/operator/catch"
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeUntil';
import { interval } from 'rxjs/observable/interval';
import { environment } from '../../environments/environment';

import * as jwtDecode from 'jwt-decode';
import { Subscription } from 'rxjs/Subscription';
import { Subscriber } from 'rxjs/Subscriber';

@Injectable()
export class TokenService {

  private token$: BehaviorSubject<Token> = new BehaviorSubject<Token>(null);

  private iframe: HTMLIFrameElement;

  constructor() {
    
    this.iframe = document.createElement('iframe');
    this.iframe.style.width = '0px';
    this.iframe.style.height = '0px';
    this.iframe.style.border = '0'
    document.body.appendChild(this.iframe);
    
    this.token
      .do(t => t === null ? console.log("New token: %o", t) : console.group("New Token: %o", t))
      .switchMap(t => 
        t === null ? 
        Observable.of(null) : 
        Observable.of(t).repeatWhen(t => t.delay(10000))
      ).filter(t => t !== null)
      .do(t => console.log("Expires in: %o", t.expInMS))
      .filter(t => t.expInMS < 10000)
      .do(t => console.warn("Token about to expire: %o", t))
      .switchMap(t => this.refreshIframe())
      .catch(err => Observable.of(<string>null))
      .do(t => console.groupEnd())
      .subscribe(t => this.nextToken(t));

  }

  public nextToken(token: String) {
    this.token$.next(this.extractToken(token));
  }

  private refreshIframe() {

    let evListener = (obs: Subscriber<string>) => (ev: MessageEvent)  => {
      if (!ev.data.token) {
        return;
      } else {
        obs.next(ev.data.token);
      }
      obs.complete();
    }

    let listener;

    let observable = new Observable<String>(obs => {
      
      listener = evListener(obs);

      window.addEventListener('message', listener)
      
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
      .timeout(5000)
      .do(t => window.removeEventListener('message', listener))
      .catch(function(err){ 
        window.removeEventListener('message', listener)
        console.error("Token refresh failed: %e", err)
        return Observable.throw(err);
      })
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

  

  get token(): Observable<Token> {
    return this.token$.asObservable();
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

  get expInMS(): number {
    return (new Date(this.decodedAccessToken.exp * 1000).getTime() - new Date().getTime());
  }

  get decodedAccessToken(): AccessToken {
    return <AccessToken>jwtDecode(this.access_token);
  }
}