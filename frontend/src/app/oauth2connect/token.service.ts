import { Token } from './oauth2connect.component';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { timeout } from 'q';

@Injectable()
export class TokenService {

  private token$: BehaviorSubject<Token> = new BehaviorSubject<Token>(null);
  private expireSeconds$: BehaviorSubject<number> = new BehaviorSubject<number>(null);


  constructor() {
    this.token.subscribe(t => {
      if (t !== null) {
        this.setupExpireTime(t);
        console.log(t.decodedAccessToken);
      }
    });
  }

  public nextToken(token: Token) {
    this.token$.next(token);
  }

  private setupExpireTime(token: Token) {
    setTimeout(() => {
      const diff = this.diffInSecondsForExp(token.decodedAccessToken.exp);
      if (diff < 0 || token === null) {
        this.token$.next(null);
        this.expireSeconds$.next(null);
        return;
      }
      this.expireSeconds$.next(diff);
      this.setupExpireTime(this.token$.getValue());
    }, 1000);
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
