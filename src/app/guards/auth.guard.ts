import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { NavigateHlperService } from '../services/utils/navigate-hlper.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(
    private authenticationService: AuthenticationService,
    private navigateService: NavigateHlperService
  ) {}
  canLoad(): Observable<boolean> {
    return this.authenticationService.isAuthenticated$.pipe(
      filter((val) => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map((isAuthenticated) => {
        console.log(isAuthenticated)
        if (isAuthenticated) {
          return true;
        } else {
          this.navigateService.goToLogin();
          return false;
        }
      })
    );
  }
}
