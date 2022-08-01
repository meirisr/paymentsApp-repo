import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { map, tap } from 'rxjs/operators';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ToastController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { StorageService, UserDetails } from './storage.service';

const PHONE_NUM = 'my-phone';
const HEADER_HOTELS = 'hotels';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  didSendSms: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isUserHasDetails: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );
  isUserPermitToOrg: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  userDetails = new BehaviorSubject({ firstName: '', lastName: '', email: '' });
  isCardHasDetails: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    public toastController: ToastController,
    private utils: UtilsService
  ) {}

  public getAllOrganizations(): Observable<any> {
    return this.http.get(
      `${environment.serverUrl}/user/get-organization-per-station`,
      {
        headers: new HttpHeaders({ station: HEADER_HOTELS }),
      }
    );
  }
  public isUserPermitToOrganization(orgId): Observable<any> {
    return this.http
      .get(`${environment.serverUrl}/user/is-permit-to-organization`, {
        headers: new HttpHeaders({ organizationId: orgId }),
      })
      .pipe(
        map((data: any) => {
          if (data.body) {
            this.storageService.setHotelId(orgId);
            this.isUserPermitToOrg.next(true);
          } else {
            this.isUserPermitToOrg.next(false);
          }
          return data.body;
        })
      );
  }

  public async logDeviceInfo() {
    // await Device.getLanguageCode().then((language) => {
    //   USER_LANGUAGE = language.value.toLowerCase();
    // });
  }
  public sendVerificationCode(credentials: { phone: string }): Observable<any> {
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
        })
      );
  }

  public getUserDetails(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/user/get-user-details`).pipe(
      map((data: any) => {
        if (data.body.email && data.body.firstName && data.body.lastName) {
          this.storageService.setUserDetails(data.body);
          return this.isUserHasDetails.next(true);
        } else {
          return this.isUserHasDetails.next(false);
        }
      })
    );
  }
  public getCreditCardInfo(): Observable<any> {
    return this.http
      .get(
        `${environment.serverUrl}/credit-card-payment/get-last-digits-of-credit-card`
      )
      .pipe(
        map((data: any) => {
          if (data.body != null && data.body.length > 0) {
            this.storageService.setCreditCard4Dig(data.body);
            return this.isCardHasDetails.next(true);
          } else {
            return this.isCardHasDetails.next(false);
          }
        })
      );
  }
  public async updateUserInfo(credentials: UserDetails): Promise<any> {
    return this.http
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
          this.storageService.setUserDetails(credentials);
        })
      )
      .subscribe(
        async (res) => {
          this.handleButtonClick();
        },
        async (res) => {
          this.onHttpErorr(res, '');
        }
      );
  }
  public async updateCreditCard(credentials: {
    cardNum: string;
    csvNum: string;
    date: string;
    userId: string;
  }): Promise<any> {
    this.http
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
          this.getCreditCardInfo();
          this.handleButtonClick();
        },
        async (res) => {
          console.log(res);
          this.onHttpErorr(res, '');
        }
      );
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
