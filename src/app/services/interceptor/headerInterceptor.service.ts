import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { StorageService } from '../storage.service';
import { AuthenticationService } from '../authentication.service';
import { GetResult } from '@capacitor/storage';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  token: GetResult | string;
  refreshToken: GetResult;
  didChack = false;

  constructor(
    private storageService: StorageService,
    private authenticationService: AuthenticationService
  ) {}

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.TokenValidation(httpRequest, next)).pipe(
      switchMap((token) => {
        if (
          httpRequest.url.includes('GetDetailsByVehicle') ||
          httpRequest.url.includes('get-organization-per-station')
        ) {
          return next.handle(httpRequest);
        }
        const modifieRequest = httpRequest.clone({
          headers: httpRequest.headers.append(
            'Authorization',
            `Bearer ${token}`
          ),
        });

        return next.handle(modifieRequest);
      })
    );
  }
  TokenValidation = (httpRequest: HttpRequest<any>, next: HttpHandler) => {
    return this.storageService.getToken().then((tokenVal) => {
      if (
        tokenVal.value == null &&
        !httpRequest.url.includes('refresh-token')
      ) {
        this.authenticationService.loadToken();
        // window.location.reload();
      } else if (
        !httpRequest.url.includes('is-token-valid') &&
        !httpRequest.url.includes('refresh-token')
      ) {
        return this.authenticationService
          .isTokenValid(tokenVal.value)
          .toPromise()
          .then((val) => {
            if (!val) {
              this.authenticationService.loadToken();
            } else {
              return tokenVal.value;
            }
          });
      }
    });
  };

  sendHttp = (httpRequest: HttpRequest<any>, next: HttpHandler) => {
    if (
      httpRequest.url.includes('GetDetailsByVehicle') ||
      httpRequest.url.includes('get-organization-per-station')
    ) {
      return next.handle(httpRequest);
    }
    const modifieRequest = httpRequest.clone({
      headers: httpRequest.headers.append(
        'Authorization',
        `Bearer ${this.token}`
      ),
    });

    return next.handle(modifieRequest);
  };
}
