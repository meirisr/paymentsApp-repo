import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { LoginService } from '../services/login.service';
import { UserInfoService } from '../services/user-info.service';
import { NavigateHlperService } from '../services/utils/navigate-hlper.service';

export const INTRO_KEY = 'intro-seen';

@Injectable({
  providedIn: 'root',
})
export class IntroGuard implements CanLoad {
  constructor(
    private logInServer: LoginService,
    private userInfoService:UserInfoService,
    private navigateService: NavigateHlperService
  ) {}

  canLoad(): Observable<boolean> {
    return this.userInfoService.isUserHasDetails.pipe(
      filter((val) => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map((isUserHasDetails) => {
        if (isUserHasDetails) {
          this.navigateService.goToMenu();
          return true;
        } else {
          this.navigateService.goToUserDetails();
        }
      })
    );
  }
}
