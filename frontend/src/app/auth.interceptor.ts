import { TokenService, Token } from './oauth2connect/token.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private token: Token = null;

    constructor(private tokenService: TokenService) {
      tokenService.token.subscribe(token => {
            this.token = token;
        });
    }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if (this.token === null) {
        return next.handle(req);
      }
      req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${this.token.access_token}`
          }
        });
        return next.handle(req);
      }
}
