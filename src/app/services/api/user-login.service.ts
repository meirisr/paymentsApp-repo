import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { map, tap } from 'rxjs/operators';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils/utils.service';

const PHONE_NUM = 'my-phone';
const TOKEN_KEY = 'my-token';
const REFRESH_TOKEN_KEY = 'token-refresh';
const HEADER_HOTELS = 'hotels';
let USER_LANGUAGE = '';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  userDetailsB: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );
  userDetails = new BehaviorSubject({ firstName: '', lastName: '', email: '' });
  isUserHasDetails: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );
  token = '';
  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    public toastController: ToastController,
    private utils: UtilsService
  ) {
    this.loadToken();
  }
  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    const refreshToken = await Storage.get({ key: REFRESH_TOKEN_KEY });

    if (token && token.value && refreshToken && refreshToken.value) {
      this.isTokenValid(token.value).subscribe(
        async (res) => {
          if (!res) {
            this.refreshToken(refreshToken.value);
          } else {
            console.log('set token: ', token.value);
            this.token = token.value;
            this.isAuthenticated.next(true);
            this.getUserDetails();
          }
        },
        async (res) => {
          console.log('res');
        }
      );
    } else if (refreshToken && refreshToken.value) {
      this.refreshToken(refreshToken.value);
    } else {
      this.isAuthenticated.next(false);
    }
  }




  async logDeviceInfo() {
    await Device.getLanguageCode().then((language) => {
      USER_LANGUAGE = language.value.toLowerCase();
    });
  }

  isTokenValid(token: string): Observable<any> {
    return this.http
      .get(`${environment.serverUrl}/base-auth/is-token-valid?token=${token}`)
      .pipe(
        map((data: any) => {
          if (!data.body) {
            Storage.remove({ key: TOKEN_KEY });
          }
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
          from(this.setStorege(TOKEN_KEY, data.body.jwtToken));
          this.loadToken();
        })
      )
      .subscribe();
  }
  getSms(credentials: { phone }): Observable<any> {
    return this.http
      .post(`${environment.serverUrl}/phone-auth/send-code`, null, {
        headers: new HttpHeaders({ station: HEADER_HOTELS }),
        params: new HttpParams().set('phone', credentials.phone),
      })
      .pipe(map(() => this.setStorege(PHONE_NUM, credentials.phone)));
  }
  getToken(credentials: { phone; text }): Observable<any> {
    return this.http
      .post(`${environment.serverUrl}/phone-auth/verify-code`, null, {
        headers: new HttpHeaders({ station: HEADER_HOTELS }),
        params: new HttpParams()
          .set('phone', credentials.phone.phone)
          .set('code', credentials.text),
      })
      .pipe(
        map((data: any) => {
          from(this.setStorege(TOKEN_KEY, data.body.jwtToken));
          from(this.setStorege(REFRESH_TOKEN_KEY, data.body.refreshToken));
        }),
        tap((_) => {
          this.isAuthenticated.next(true);
        })
      );
  }
  setStorege(k: string, v: string): Promise<any> {
    return Storage.set({ key: k, value: v });
  }
  async getUserDetails(): Promise<any> {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      return this.http
        .get(
          `${environment.serverUrl}/user/get-user-details`,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          {
            headers: new HttpHeaders({
              authorization: `Bearer ${token.value}`,
            }),
          }
        )
        .pipe(
          map((data: any) => {
            this.userDetails.next(data.body);
            if (data.body.email && data.body.firstName && data.body.lastName) {
             return this.isUserHasDetails.next(true);
            } else {
             return this.isUserHasDetails.next(false);
            }
          })
        )
        .subscribe(
          async (res) => {
          
          },
          async (res) => {
            this.onHttpErorr(res, '');
          }
        );
    }
  }
  async updateUserInfo(credentials: {
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<any> {
    const token = await Storage.get({ key: TOKEN_KEY });
    return (
      this.http
        // eslint-disable-next-line max-len
        .post(
          `${environment.serverUrl}/user/update-details`,
          {
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            email: credentials.email,
          },
          {
            headers: new HttpHeaders({ station: 'hotels' }).append(
              'Authorization',
              `Bearer ${token.value}`
            ),
          }
        )
        .pipe(map(() => this.setStorege(PHONE_NUM, credentials.firstName)))
        .subscribe(
          async (res) => {
            this.handleButtonClick();
            this.getUserDetails();
          },
          async (res) => {
            this.onHttpErorr(res, '');
          }
        )
    );
  }
  async handleButtonClick() {
    const toast = await this.toastController.create({
      color: 'success',
      duration: 2000,
      position: 'bottom',
      message: 'Successfully updated',
    });

    await toast.present();
  }
  async onHttpErorr(e, header) {
    this.utils.showalert(e, header);
  }
}
