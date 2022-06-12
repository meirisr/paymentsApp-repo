import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { map, tap} from 'rxjs/operators';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject, from, Observable} from 'rxjs';
import { environment } from '../../../environments/environment';
const PHONE_NUM = 'my-phone';
const TOKEN_KEY = 'my-token';
const REFRESH_TOKEN_KEY = 'token-refresh';
let USER_LANGUAGE='';
@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );
  token = '';
  constructor(private http: HttpClient) {
    this.logDeviceInfo();
    this.loadToken();
  }
  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    const refreshToken = await Storage.get({ key: REFRESH_TOKEN_KEY });
    if (token && token.value && this.isTokenValid(token.value).subscribe()) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }
  async logDeviceInfo() {
     await Device.getLanguageCode().then((language)=>{
      USER_LANGUAGE=language.value.toLowerCase();
     });
  }

  isTokenValid(token: string): Observable<any> {
    return this.http
      .get(`${environment.serverUrl}/base-auth/is-token-valid?token=${token}`)
      .pipe(
        map((data: any) => {
          console.log(data.body);
          return data.body;
        })
      );
  }
  refreshToken(token: string) {
    this.http
      .get(
        `${environment.serverUrl}/base-auth/refresh-token?refreshToken=${token}`
      )
      .pipe(
        map((data: any) => {
          console.log(data);
        })
      )
      .subscribe();
  }
  getSms(credentials: { phone }): Observable<any> {
    return this.http
      .post(`${environment.serverUrl}/phone-auth/send-code`, null, {
        headers: new HttpHeaders({ station: 'hotels' })
        ,
        params: new HttpParams().set('phone', credentials.phone),
      })
      .pipe(
        map(() =>this.setStorege(PHONE_NUM , credentials.phone ))
      );
  }
  getToken(credentials: {phone;text }): Observable<any> {
    return this.http
      .post(`${environment.serverUrl}/phone-auth/verify-code`, null, {
        headers: new HttpHeaders({ station: 'hotels'}),
        params: new HttpParams()
          .set('phone', credentials.phone.phone)
          .set('code', credentials.text.text),
      })
      .pipe(
        map((data: any) => {
          console.log(data.body);
          from( this.setStorege(TOKEN_KEY,data.body.jwtToken ));
          from(this.setStorege(REFRESH_TOKEN_KEY,data.body.refreshToken));
        }),
        tap((_) => {
          this.isAuthenticated.next(true);
        })
      );
  }
  setStorege(k: string,v: string): Promise<any> {
   return Storage.set({ key: k, value: v });
  }
}
