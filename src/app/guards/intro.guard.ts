import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { LoginService } from '../services/login.service';
import { NavigateHlperService } from '../services/utils/navigate-hlper.service';

export const INTRO_KEY = 'intro-seen';

@Injectable({
  providedIn: 'root',
})
export class IntroGuard implements CanLoad {
  constructor(
    private logInServer: LoginService,
    private navigateService: NavigateHlperService
  ) {}

  canLoad(): Observable<boolean> {
    return this.logInServer.isUserPermitToOrg.pipe(
      filter((val) => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map((isUserPermitToOrg) => {
        if (isUserPermitToOrg) {
          this.navigateService.goToMenu();
          return true;
        } else {
          return true;
        }
      })
    );
  }
}
