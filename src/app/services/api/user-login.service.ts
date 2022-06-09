import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  constructor(private http: HttpClient) {}

  loginAndGetSms(control) {
    const phone = control;

    this.http
      .post(`${environment.serverUrl}/phone-auth/send-code`, null, {
        headers: new HttpHeaders({ station: 'hotels'}),
        params:  new HttpParams().set('phone',phone),
      })
      .subscribe((responseData) => {
        console.log(responseData);
      });
    console.log(typeof phone);
  }
}
