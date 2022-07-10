import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilsService } from '../utils/utils.service';



const TOKEN_KEY = 'my-token';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor { 
  token:string;

  constructor(private utils:UtilsService){
    
  }

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     this.utils.getStorege(TOKEN_KEY).then((val)=>{
      this.token=val.value
     })
 
     if(httpRequest.url==`http://31.168.140.163:8090/TGServer/webresources/App/Send_App_Status`){
      return next.handle(httpRequest);
     }
     const modifieRequest=httpRequest.clone({headers: httpRequest.headers.append('Authorization', `Bearer ${this.token}`)})
    return next.handle(modifieRequest);
  }
}