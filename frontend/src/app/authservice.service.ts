import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthserviceService {

  private accesToken: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor() {
    this.accesToken.subscribe(t => {
      console.log(t);
    });
  }

  public nextToken(token: string) {
    this.accesToken.next(token);
  }

  public accessToken(): Observable<string> {
    return this.accesToken.asObservable();
  }

}
