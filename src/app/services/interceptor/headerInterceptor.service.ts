import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { StorageService } from '../storage.service';
import { tap } from 'rxjs/operators';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  token: string;

  constructor(private storageService: StorageService,private authenticationService: AuthenticationService) {}

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    
    // this.authenticationService.loadToken().then(()=>{
    //   this.token=this.authenticationService.token.value
    // })
    this.storageService.getToken().then((val) => {
     
            this.token = val.value;
    });

    if (
      httpRequest.url.includes('GetDetailsByVehicle') 
      ||
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
}
