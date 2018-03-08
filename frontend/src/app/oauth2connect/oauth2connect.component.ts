import { environment } from './../../environments/environment';
import { TokenService } from './token.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Params } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import * as jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-oauth2connect',
  templateUrl: './oauth2connect.component.html',
  styleUrls: ['./oauth2connect.component.css']
})
export class Oauth2connectComponent implements OnInit {

  constructor(private route: ActivatedRoute, private tokenService: TokenService, private router: Router) {

    this.route.fragment.subscribe((fragment: String) => {
      const token = this.extractToken(fragment);
      if (token === null) {
        this.loginRedirect();
      }
      router.navigate(['/']);
      this.tokenService.nextToken(token);

    });

  }

  private loginRedirect() {
    const authServerUrl = environment.authUrl + '/oauth/authorize';
    const redirectUrl = window.location.origin + '/connect';
    const queryParams = new URLSearchParams();
    queryParams.set('response_type', 'token');
    queryParams.set('client_id', 'acme');
    queryParams.set('redirect_uri', redirectUrl);
    queryParams.set('scope', 'read write');
    queryParams.set('state', 'blablubb'); // use random value here...
    window.location.href = authServerUrl + '?' + queryParams.toString();
  }

  private extractToken(fragment) {
    if (fragment === null || fragment === undefined || fragment === '') { return null; }

    const params = fragment.split('&');
    const pairs = params.map(p => p.split('='));

    const token = new Token();
    token.access_token = pairs.find(p => p[0] === 'access_token')[1];
    token.token_type = pairs.find(p => p[0] === 'token_type')[1];
    token.expires_in = pairs.find(p => p[0] === 'expires_in')[1];
    token.state = pairs.find(p => p[0] === 'state')[1];
    token.jti = pairs.find(p => p[0] === 'jti')  [1];
    return token;

  }

  ngOnInit() {
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
