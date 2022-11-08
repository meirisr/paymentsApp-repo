import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { GetResult } from '@capacitor/storage';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService, userStoregeObj } from './storage.service';
import { LoginService } from './login.service';
import { UtilsService } from './utils/utils.service';
import { UserInfoService } from './user-info.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );

  private refreshToken: GetResult;
  private hotelId: GetResult;
  private hotelName: GetResult;
  public token: GetResult;
  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private loginService: LoginService,
    private userInfoServer: UserInfoService,
    private utils: UtilsService
  ) {}

  getDataFromStorage = async (): Promise<void> => {
    this.token = await this.storageService.getToken();
    this.refreshToken = await this.storageService.getRefreshToken();
    this.hotelId = await this.storageService.getHotelId();
    this.hotelName = await this.storageService.getHotelName();
  };
  getAllUserInfo = () => {
    this.userInfoServer.getUnpaidTrips();
    this.userInfoServer.getUserDetails();
    this.userInfoServer.getCreditCardInfo();
    if (this.hotelId.value != null && this.hotelName != null) {
      this.loginService
        .isUserPermitToOrganization(this.hotelId.value, this.hotelName.value)
        .subscribe();
    }
  };

  public async loadToken() {
    await this.getDataFromStorage();
    if (this.token.value != null && this.refreshToken.value != null) {
      this.isTokenValid(this.token.value).subscribe(
        async (res: boolean) => {
          if (res) {
            this.getAllUserInfo();
            this.isAuthenticated$.next(true);
          } else {
            this.storageService.deleteStorege(userStoregeObj.TOKEN_KEY);
            this.storageService.deleteStorege(userStoregeObj.HOTEL_ID);
            this.loadToken();
          }
        },
        async (err) => {
          console.log(err);
          this.onHttpErorr(err, '');
        }
      );
    } else if (this.refreshToken.value) {
      this.tryRefreshToken(this.refreshToken.value).subscribe(
        (data) => {
          if (data.body.responseType == 'VALID') {
            this.storageService.setToken(data.body.jwtToken);
            this.loadToken();
          }
        },
        async (err) => {
          console.log(err);
          this.onHttpErorr(err, '');
        }
      );
    } else {
      this.isAuthenticated$.next(false);
    }
  }

  public isTokenValid(Token: string): Observable<boolean> {
    try {
      return this.http
        .get(`${environment.serverUrl}/base-auth/is-token-valid?token=${Token}`)
        .pipe(
          map((data: any) => {
            return data.body;
          })
        );
    } catch (error) {
      this.onHttpErorr(
        ' עקב תקלה לא ניתן לגשת לאפליקציה אנא נסה/י בעוד כמה דקות.',
        'תקלת תקשורת'
      );
    }
  }

  public tryRefreshToken(refreshToken: string): Observable<any> {
    try {
      return this.http.get(
        `${environment.serverUrl}/base-auth/refresh-token?refreshToken=${refreshToken}`
      );
    } catch (error) {
      this.onHttpErorr(
        ' עקב תקלה לא ניתן לגשת לאפליקציה אנא נסה/י בעוד כמה דקות.',
        'תקלת תקשורת'
      );
    }
  }
  async onHttpErorr(e: string, header: string) {
    this.utils.showalert(e, header);
  }
}
