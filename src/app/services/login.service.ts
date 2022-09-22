import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ToastController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { StorageService, UserDetails, userStoregeObj } from './storage.service';
import { UserInfoService } from './user-info.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  didSendSms: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  isUserPermitToOrg: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
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
        headers: new HttpHeaders({ station: userStoregeObj.HEADER_HOTELS }),
      }
    );
  }
  public isUserPermitToOrganization(orgId: string): Observable<any> {
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

  public sendVerificationCode(credentials: { phone: string }): Observable<any> {
    return this.http
      .post(`${environment.serverUrl}/phone-auth/send-code`, null, {
        headers: new HttpHeaders({ station: userStoregeObj.HEADER_HOTELS }),
        params: new HttpParams().set('phone', credentials.phone),
      })
      .pipe(
        tap(() => {
          this.storageService.setUserPhoneNumber(credentials.phone);
          this.storageService.setStorege(
            userStoregeObj.PHONE_NUM,
            credentials.phone
          );
        })
      );
  }

  public getToken(credentials: {
    phone: string;
    text: string;
  }): Observable<void> {
    return this.http
      .post(`${environment.serverUrl}/phone-auth/verify-code`, null, {
        headers: new HttpHeaders({ station: userStoregeObj.HEADER_HOTELS }),
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

  public async handleButtonClick(): Promise<void> {
    const toast = await this.toastController.create({
      color: 'light',
      duration: 3000,
      position: 'bottom',
      message: 'הפרטים עודכנו בצלחה',
    });
    await toast.present();
  }
  public async onHttpErorr(e, header) {
    this.utils.showalert(e, header);
  }
}
