import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { UserLoginService } from '../services/api/user-login.service';

export const INTRO_KEY = 'intro-seen';

@Injectable({
  providedIn: 'root',
})
export class IntroGuard implements CanLoad {
  constructor(
    private apiUserServer: UserLoginService,
    private router: Router
  ) {}

  canLoad(): Observable<boolean> {
    this.apiUserServer.getUserDetails();
    this.apiUserServer.getCreditCardInfo();
    return this.apiUserServer.isUserHasDetails.pipe(
      filter((val) => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map((isUserHasDetails) => {
        console.log('intro');
        if (isUserHasDetails) {
          // Directly open inside area
          console.log(isUserHasDetails);
          return true;
        } else {
          console.log('now intro');
          console.log(isUserHasDetails);
          this.router.navigateByUrl('/user-details', { replaceUrl: true });
          return false;
        }
      })
    );
  }
}
