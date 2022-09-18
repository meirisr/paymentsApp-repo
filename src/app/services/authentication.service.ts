import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { GetResult } from '@capacitor/storage';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { LoginService } from './login.service';
import { UtilsService } from './utils/utils.service';
const TOKEN_KEY = 'my-token';
const HOTEL_ID = 'my-hotel';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );
  private token: GetResult;
  private refreshToken: GetResult;
  private hotelId: GetResult;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private loginService: LoginService,
    private utils: UtilsService
  ) {}
  public async loadToken() {
    this.token = await this.storageService.getToken();
    this.refreshToken = await this.storageService.getRefreshToken();
    this.hotelId = await this.storageService.getHotelId();

    if (this.token.value != null && this.refreshToken.value != null) {
      this.isTokenValid(this.token.value).subscribe(
        async (res) => {
          if (res) {
            this.loginService.getUserDetails().subscribe(
              () => {
                this.loginService.isUserHasDetails.subscribe(
                  (v)=>console.log("isUserHasDetails:",v)
                )
              },
              (err) => {
                console.log(err);
              }
            );
            this.loginService.getCreditCardInfo().subscribe(
              () => {
                this.loginService.isUserHasDetails.subscribe(
                  (v)=>console.log("isCardHasDetails:",v)
                )
              },
              (err) => {
                console.log(err);
              }
            );
            if (this.hotelId.value != null) {
              this.loginService
                .isUserPermitToOrganization(this.hotelId.value)
                .subscribe(
                  (data) => {
                    console.log(data);
                  },
                  (err) => {
                    console.log(err);
                  }
                );
            }

            this.isAuthenticated.next(true);
          } else {
            this.loadToken();
          }
        },
        async (err) => {
          console.log(err);
        }
      );
    } else if (this.refreshToken.value) {
      this.tryRefreshToken(this.refreshToken.value).subscribe((data) => {
        if (data.body.responseType == 'VALID') {
          this.storageService.setToken(data.body.jwtToken);
          this.loadToken();
        }
      });
    } else {
      this.isAuthenticated.next(false);
    }
  }
  public isTokenValid(refreshToken: string): Observable<any> {
    try {
      return this.http
      .get(
        `${environment.serverUrl}/base-auth/is-token-valid?token=${refreshToken}`
      )
      .pipe(
        map((data: any) => {
          if (!data.body) {
            this.storageService.deleteStorege(TOKEN_KEY);
            this.storageService.deleteStorege(HOTEL_ID);
          }
          return data.body;
        })
      );
    } catch (error) {
      this.onHttpErorr(" עקב תקלה לא ניתן לגשת לאפליקציה אנא נסה/י בעוד כמה דקות.", "תקלת תקשורת")
    }
   
  }

  public tryRefreshToken(refreshToken: string) {
    return this.http
      .get(
        `${environment.serverUrl}/base-auth/refresh-token?refreshToken=${refreshToken}`
      )
      .pipe(
        tap((data: any) => {
          this.storageService.setToken(data.body.jwtToken);
        })
      );
  }
  async onHttpErorr(e, header) {
    this.utils.showalert(e, header);
  }
}
