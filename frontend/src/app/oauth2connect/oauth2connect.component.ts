import { environment } from './../../environments/environment';
import { TokenService } from './token.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Params } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-oauth2connect',
  templateUrl: './oauth2connect.component.html',
  styleUrls: ['./oauth2connect.component.css']
})
export class Oauth2connectComponent implements OnInit {

  constructor(private route: ActivatedRoute, private tokenService: TokenService, private router: Router) {

    this.route.fragment.subscribe((fragment: String) => {
      if (fragment === null || fragment === undefined) {
        this.loginRedirect();
      }
      this.tokenService.nextToken(fragment);
      router.navigate(['/']);

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
    //queryParams.set('state', 'blablubb'); // use random value here...
    window.location.href = authServerUrl + '?' + queryParams.toString();
  }

  ngOnInit() {
  }

}

