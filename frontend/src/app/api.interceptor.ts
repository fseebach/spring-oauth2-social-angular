import { environment } from './../environments/environment';
import { TokenService } from './oauth2connect/token.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

    constructor() {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      let targetUrl = req.url;
      if (req.url.startsWith('/api')) {
        targetUrl = environment.apiUrl + req.url;
      }
      req = req.clone({
          url: targetUrl
        });
        return next.handle(req);
      }
}
