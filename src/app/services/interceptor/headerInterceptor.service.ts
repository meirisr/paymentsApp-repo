import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { StorageService } from '../storage.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  token: string;

  constructor(private storageService: StorageService) {}

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
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
        `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyOSIsInJscyI6IlJPTEVfT1JHQU5JWkFUSU9OX01BTkFHRVIiLCJzdG4iOjE5LCJleHAiOjE2NjQzNjYzMDJ9.gyVfn0LLLX7-zU6dbyi_ZsrTp0lveY4W1YUb-_jap32ZCgP5p4fQ5GYMBMJQtZ4FgcQesUTMSTL0gHtrThn1Lg`
      ),
    });
    return next.handle(modifieRequest);
  }
}
