import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
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
  isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  
  private token: GetResult;
  private refreshToken: GetResult;
  private hotelId: GetResult;
  private hotelName: GetResult;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private loginService: LoginService,
    private userInfoServer:UserInfoService,
    private utils: UtilsService
  ) {}
  public async loadToken() {
    this.token = await this.storageService.getToken();
    this.refreshToken = await this.storageService.getRefreshToken();
    this.hotelId = await this.storageService.getHotelId();
    this.hotelName = await this.storageService.getHotelName();
    if (this.token.value != null && this.refreshToken.value != null) {
      this.isTokenValid(this.token.value).subscribe(
        async (res) => {
          console.log(res)
          if (res) {
            this.userInfoServer.getUnpaidTrips();
            this.userInfoServer.getUserDetails().subscribe(
              async() => {
                this.userInfoServer.isUserHasDetails.subscribe((v) =>
                  console.log('isUserHasDetails:', v)
                );
              },
              async (err) => {
                console.log(err);
                this.onHttpErorr(err, '');
              }
            );
            this.userInfoServer.getCreditCardInfo().subscribe(
              async() => {
                this.userInfoServer.isCardHasDetails.subscribe((v) =>
                  console.log('isCardHasDetails:', v)
                );
              },
              async (err) => {
                console.log(err);
                this.onHttpErorr(err, '');
              }
            );
            if (this.hotelId.value != null) {
              this.loginService
                .isUserPermitToOrganization(this.hotelId.value,this.hotelName.value)
                .subscribe(
                  (data) => {
                    console.log(data);
                  },
                  async (err) => {
                    console.log(err);
                    this.onHttpErorr(err, '');
                  }
                );
            }

            this.isAuthenticated$.next(true);
          } else {
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

 
  public isTokenValid(Token: string): Observable<any> {
    try {
      return this.http
        .get(
          `${environment.serverUrl}/base-auth/is-token-valid?token=${Token}`
        )
        .pipe(
          map((data: any) => {
            if (!data.body) {
              this.storageService.deleteStorege(userStoregeObj.TOKEN_KEY);
              this.storageService.deleteStorege(userStoregeObj.HOTEL_ID);
            }
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

  public tryRefreshToken(refreshToken: string) {
    try {
      return this.http
        .get(
          `${environment.serverUrl}/base-auth/refresh-token?refreshToken=${refreshToken}`
        )
        .pipe(
          tap((data: any) => {
            this.storageService.setToken(data.body.jwtToken);
          })
        );
    } catch (error) {
      this.onHttpErorr(
        ' עקב תקלה לא ניתן לגשת לאפליקציה אנא נסה/י בעוד כמה דקות.',
        'תקלת תקשורת'
      );
    }
  }
  async onHttpErorr(e, header) {
    this.utils.showalert(e, header);
  }
}
