import { Observable } from 'rxjs/Observable';
import { TokenService, Token } from './../oauth2connect/token.service';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/repeatWhen";
import "rxjs/add/operator/skip";
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public token: Observable<Token> = null;
  
  constructor(private tokenService: TokenService) {
    this.token = tokenService.token;

  }

  ngOnInit() {
  }

}
