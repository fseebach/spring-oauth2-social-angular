import { AuthserviceService } from './authservice.service';
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

    private authToken = '';

    constructor(private auth: AuthserviceService) {
        auth.accessToken().subscribe(token => {
            this.authToken = token;
        });
    }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${this.authToken}`
          }
        });
        return next.handle(req);
      }
}
