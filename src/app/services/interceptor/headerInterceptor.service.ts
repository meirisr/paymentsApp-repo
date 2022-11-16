import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../storage.service';
import { AuthenticationService } from '../authentication.service';
import { GetResult } from '@capacitor/storage';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  token: GetResult | string;
  refreshToken: GetResult;

  constructor(
    private storageService: StorageService,
    private authenticationService: AuthenticationService
  ) {}

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    this.storageService.getToken().then((tokenVal) => {
       this.TokenValidation(httpRequest, tokenVal);
    }).then(()=>{
      
    })
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
   
    
  }
  TokenValidation =  (httpRequest: HttpRequest<any>, tokenVal: GetResult) => {
    if (tokenVal.value == null && !httpRequest.url.includes('refresh-token')) {
      this.authenticationService.loadToken();
    } else if (
      !httpRequest.url.includes('is-token-valid') &&
      !httpRequest.url.includes('refresh-token') 
      // &&!httpRequest.url.includes('get-unpaid-drives-per-user')
    ) {
      this.authenticationService
        .isTokenValid(tokenVal.value)
        .subscribe((val) => {
          if (!val) {
            this.authenticationService.loadToken();
          }
        });
    }
    this.token = tokenVal.value;
  };

  sendHttp=()=>{

    
  }
}
