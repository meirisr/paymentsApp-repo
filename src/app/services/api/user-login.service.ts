import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { map, tap } from 'rxjs/operators';
import { GetResult, Storage } from '@capacitor/storage';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { StorageService, UserDetails } from '../storage.service';
import { promise } from 'protractor';
import { TemporaryStorageService } from '../temporary-storage.service';

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
  token: GetResult;
  refreshToken : GetResult;
  Coordinates = <any>[];

  didSendSms: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );
  isUserHasDetails: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );
  userDetails = new BehaviorSubject({ firstName: '', lastName: '', email: '' });
  isCardHasDetails: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private tempStorageServer: TemporaryStorageService,
    public toastController: ToastController,
    private utils: UtilsService
  ) {
    // this.loadToken();
  }
  public async loadToken() {
    this.token = await this.storageService.getToken();
    this.refreshToken = await this.storageService.getRefreshToken();
     
    if (this.token.value!=null && this.refreshToken.value!=null)
     {
      this.isTokenValid(this.token.value).subscribe(
        async (res) => {
          console.log(res)
          if (!res) {
            this.tryRefreshToken(this.refreshToken.value).subscribe(() => {
              this.loadToken();
            });
          } else {
            this.getUserDetails().subscribe();
            this.getCreditCardInfo().subscribe();
            this.isAuthenticated.next(true);
          }
        },
        async (res) => {
          console.log('res');
        }
      );
    } else if (this.refreshToken.value) {
      this.tryRefreshToken(this.refreshToken.value).subscribe(() => {
        this.loadToken();
      });
    } else {
      this.isAuthenticated.next(false);
    }
  }

  public async logDeviceInfo() {
    await Device.getLanguageCode().then((language) => {
      USER_LANGUAGE = language.value.toLowerCase();
    });
  }

  public isTokenValid(token: string): Observable<any> {
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
  public tryRefreshToken(token: string) {
    return this.http
      .get(
        `${environment.serverUrl}/base-auth/refresh-token?refreshToken=${token}`
      )
      .pipe(
        tap((data: any) => {
          this.storageService.setToken(data.body.jwtToken);
          this.getUserDetails().subscribe();
          this.getCreditCardInfo().subscribe();
        })
      );
  }
  public getSms(credentials: { phone: string }): Observable<any> {
    return this.http
      .post(`${environment.serverUrl}/phone-auth/send-code`, null, {
        headers: new HttpHeaders({ station: HEADER_HOTELS }),
        params: new HttpParams().set('phone', credentials.phone),
      })
      .pipe(
        tap(() => {
          this.storageService.setUserPhoneNumber(credentials.phone);
          this.storageService.setStorege(PHONE_NUM, credentials.phone);
        })
      );
  }

  public getToken(credentials: {
    phone: string;
    text: string;
  }): Observable<any> {
    return this.http
      .post(`${environment.serverUrl}/phone-auth/verify-code`, null, {
        headers: new HttpHeaders({ station: HEADER_HOTELS }),
        params: new HttpParams()
          .set('phone', credentials.phone)
          .set('code', credentials.text),
      })
      .pipe(
        tap((data: any) => {
          this.storageService.setRefreshToken(data.body.refreshToken);
          this.storageService.setToken(data.body.jwtToken);
          this.token = data.body.jwtToken;
          this.refreshToken = data.body.refreshToken;
          this.isAuthenticated.next(true);
        })
      );
  }

  public getUserDetails(): Observable<any> {
    if (!this.token) return;
    return this.http.get(`${environment.serverUrl}/user/get-user-details`).pipe(
      map((data: any) => {
        console.log(data);
        this.storageService.setUserDetails(data.body);
        this.utils.setStorege(USER_DETAILS, JSON.stringify(data.body));
        this.userDetails.next(data.body);
        if (data.body.email && data.body.firstName && data.body.lastName) {
          return this.isUserHasDetails.next(true);
        } else {
          return this.isUserHasDetails.next(false);
        }
      })
    );
    // } else {
    //   this.isUserHasDetails.next(false);
    // }
  }
  public getCreditCardInfo(): Observable<any> {
    // const cardData = await Storage.get({ key: CARD_DETAILS });
    // const token = await Storage.get({ key: TOKEN_KEY });
    // if (cardData && cardData.value) {
    //   return this.isCardHasDetails.next(true);
    // } else
    // if (this.token && this.token.value) {
    if (!this.token) return;
    return this.http
      .get(
        `${environment.serverUrl}/credit-card-payment/get-last-digits-of-credit-card`
      )
      .pipe(
        map((data: any) => {
          this.storageService.setCreditCard4Dig(data.body);
          this.utils.setStorege(CARD_DETAILS, data.body);

          return this.isCardHasDetails.next(true);
          // if (data.body.email && data.body.firstName && data.body.lastName) {
          //   return this.isUserHasDetails.next(true);
          // } else {
          //   return this.isUserHasDetails.next(false);
          // }
        })
      );
    // } else {
    //    this.isCardHasDetails.next(false);
    // }
  }
  public async updateUserInfo(credentials: UserDetails): Promise<any> {
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
            headers: new HttpHeaders({ station: 'hotels' }),
          }
        )
        .pipe(
          tap(() => {
            this.utils.setStorege(USER_DETAILS, JSON.stringify(credentials));
            this.storageService.setUserDetails(credentials);
          })
        )
        .subscribe(
          async (res) => {
            this.handleButtonClick();
            this.getUserDetails().subscribe();
            this.getCreditCardInfo().subscribe();
          },
          async (res) => {
            this.onHttpErorr(res, '');
          }
        )
    );
  }
  public async updateCreditCard(credentials: {
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
          headers: new HttpHeaders({ station: 'hotels' }),
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
  public async paymentTranportation(credentials: {
    phone: string;
    text: string;
  }): Promise<any> {
    const token = await Storage.get({ key: TOKEN_KEY });
    return this.http
      .post(
        `${environment.serverUrl}/phone-auth/verify-code`,
        {
          paymentAmount: 6,
          //  currency = Currency.NIS; //לא צריך לשלוח את הפרמטר הזה כשמדובר בשקלים
          route: '',
          trip: '',
          fromStop: '',
          toStop: '',
        },
        {
          headers: new HttpHeaders({ station: 'hotels' }),
        }
      )
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

  public getTravel(): Observable<any> {
    try {
      return this.http
        .post(
          `http://31.168.140.163:8090/TGServer/webresources/App/Send_App_Status`,

          {
            data: [], // איך לך בזה צורך
            Source: '0', // תגדיר עם נריה מזהה של האפליקציה שלך
            Version: 1, // גירסת האפליקציה שלך
            deviceCode: '-1', // מזהה חד ערכי של המכשיר שלך
            isVicFixed: true, // האם המכשיר קבוע ברכב או לא (מכשיר פרטי של נהג)
            Vehicle: 	7722969,
            TimeStamp: 111111111, // unix time
            curVehicleTime: -1, // unix time get from neria, can enter -1
          }
        )
        .pipe(
          map((data: any) => {
            if (data.data.drives.length < 1) return;

            data.data.drives[0].Coordinates.forEach((element) => {
              this.Coordinates.push(this.creatPathArray(element));
            });
          })
        );
    } catch (error) {
      console.log(error);
    }
  }
  creatPathArray(obj) {
    return { lat: obj.lat, lng: obj.lon };
  }

  public async handleButtonClick() {
    const toast = await this.toastController.create({
      color: 'success',
      duration: 2000,
      position: 'bottom',
      message: 'Successfully updated',
    });

    await toast.present();
  }
  public async onHttpErorr(e, header) {
    this.utils.showalert(e, header);
  }
}
