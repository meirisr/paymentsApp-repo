import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { GetResult, Storage } from '@capacitor/storage';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { LoginService } from './login.service';
const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );
  private token: GetResult;
  private refreshToken: GetResult;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private loginService: LoginService
  ) {}
  public async loadToken() {
    this.token = await this.storageService.getToken();
    this.refreshToken = await this.storageService.getRefreshToken();

    if (this.token.value != null && this.refreshToken.value != null) {
      this.isTokenValid(this.token.value).subscribe(
        async (res) => {
          if (res) {
            this.loginService.getUserDetails().subscribe((data) => {
              console.log(data),
                (err) => {
                  console.log(err);
                };
            });
            this.loginService.getCreditCardInfo().subscribe((data) => {
              (err) => {
                console.log(err);
              };
            });

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
    return this.http
      .get(
        `${environment.serverUrl}/base-auth/is-token-valid?token=${refreshToken}`
      )
      .pipe(
        map((data: any) => {
          if (!data.body) {
            Storage.remove({ key: TOKEN_KEY });
          }
          return data.body;
        })
      );
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
}
