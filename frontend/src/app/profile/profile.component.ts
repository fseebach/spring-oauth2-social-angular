import { Observable } from 'rxjs/Observable';
import { TokenService, Token } from './../oauth2connect/token.service';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/repeatWhen";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public token: Observable<Token> = null;
  public expireTimeSeconds = new BehaviorSubject<number>(null);

  constructor(private tokenService: TokenService) {
    this.token = tokenService.token;
    
    this.token
      .filter(t => t !== null)
      .switchMap(t => Observable.of(t).repeatWhen(t => t.delay(1000)))
      .subscribe(t => this.expireTimeSeconds.next(t.expInMS / 1000))

  }

  ngOnInit() {
  }

}
