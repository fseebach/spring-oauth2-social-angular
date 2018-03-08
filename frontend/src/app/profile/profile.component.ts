import { Token } from './../oauth2connect/oauth2connect.component';
import { Observable } from 'rxjs/Observable';
import { TokenService } from './../oauth2connect/token.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public token: Observable<Token> = null;
  public expireTimeSeconds: Observable<number> = null;

  constructor(private tokenService: TokenService) {
    this.token = tokenService.token;
    this.expireTimeSeconds = tokenService.expireSeconds;
  }

  ngOnInit() {
  }

}
