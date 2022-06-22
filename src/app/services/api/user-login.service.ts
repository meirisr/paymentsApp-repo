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
const USER_DETAILS = 'user-details';
const CARD_DETAILS = 'card-details';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  userDetailsB: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );
  userDetails = new BehaviorSubject({ firstName: '', lastName: '', email: '' });
  creditCardDetails = new BehaviorSubject('');
  isUserHasDetails: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );
  isCardHasDetails: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
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
      .subscribe((data: any) => {
        from(this.utils.setStorege(TOKEN_KEY, data.body.jwtToken));
        this.loadToken();
      });
  }
  getSms(credentials: { phone }): Observable<any> {
    return this.http
      .post(`${environment.serverUrl}/phone-auth/send-code`, null, {
        headers: new HttpHeaders({ station: HEADER_HOTELS }),
        params: new HttpParams().set('phone', credentials.phone),
      })
      .pipe(tap(() => this.utils.setStorege(PHONE_NUM, credentials.phone)));
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
        tap((data: any) => {
          from(this.utils.setStorege(TOKEN_KEY, data.body.jwtToken));
          from(
            this.utils.setStorege(REFRESH_TOKEN_KEY, data.body.refreshToken)
          );
          this.isAuthenticated.next(true);
        })
      );
  }

  async getUserDetails(): Promise<any> {
    console.log('hhh');
    const userData = JSON.parse(
      (await Storage.get({ key: USER_DETAILS })).value
    );
    const token = await Storage.get({ key: TOKEN_KEY });
    if (userData) {
      this.userDetails.next(userData);
      return this.isUserHasDetails.next(true);
    } else if (token && token.value) {
      return this.http
        .get(`${environment.serverUrl}/user/get-user-details`, {
          headers: new HttpHeaders({
            authorization: `Bearer ${token.value}`,
          }),
        })
        .pipe(
          map((data: any) => {
            this.utils.setStorege(USER_DETAILS, JSON.stringify(data.body));
            this.userDetails.next(data.body);
            if (data.body.email && data.body.firstName && data.body.lastName) {
              return this.isUserHasDetails.next(true);
            } else {
              return this.isUserHasDetails.next(false);
            }
          })
        )
        .subscribe(
          async (res) => {},
          async (res) => {
            this.onHttpErorr(res, '');
          }
        );
    } else {
      // return this.isUserHasDetails.next(false);
    }
  }
  async getCreditCardInfo(): Promise<any> {
    const cardData = await Storage.get({ key: CARD_DETAILS });
    const token = await Storage.get({ key: TOKEN_KEY });
    if (cardData && cardData.value) {
      this.creditCardDetails.next(cardData.value);
      return this.isCardHasDetails.next(true);
    } else if (token && token.value) {
      return this.http
        .get(
          `${environment.serverUrl}/credit-card-payment/get-last-digits-of-credit-card`,
          {
            headers: new HttpHeaders({
              authorization: `Bearer ${token.value}`,
            }),
          }
        )
        .pipe(
          map((data: any) => {
            this.utils.setStorege(CARD_DETAILS, data.body);
            console.log(data);
            this.creditCardDetails.next(data.body);
            return this.isCardHasDetails.next(true);
            // if (data.body.email && data.body.firstName && data.body.lastName) {
            //   return this.isUserHasDetails.next(true);
            // } else {
            //   return this.isUserHasDetails.next(false);
            // }
          })
        )
        .subscribe(
          async (res) => {},
          async (res) => {
            this.onHttpErorr(res, '');
          }
        );
    } else {
      return this.isCardHasDetails.next(false);
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
        .pipe(
          map(() =>
            this.utils.setStorege(USER_DETAILS, JSON.stringify(credentials))
          )
        )
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
  async updateCreditCard(credentials: {
    cardNum: string;
    csvNum: string;
    date: string;
    userId: string;
  }): Promise<any> {
    const token = await Storage.get({ key: TOKEN_KEY });
    return this.http
      .post(
        `${environment.serverUrl}/credit-card-payment/register-wallet`,
        {
          creditCardNumber: credentials.cardNum,
          verificationNumber: credentials.csvNum,
          holderId: credentials.userId,
          validUntilMonth: credentials.date.split('/')[0],
          validUntilYear: credentials.date.split('/')[1],
        },
        {
          headers: new HttpHeaders({ station: 'hotels' }).append(
            'Authorization',
            `Bearer ${token.value}`
          ),
        }
      )
      .subscribe(
        async (res) => {
          this.handleButtonClick();
          this.getCreditCardInfo();
        },
        async (res) => {
          this.onHttpErorr(res, '');
        }
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
