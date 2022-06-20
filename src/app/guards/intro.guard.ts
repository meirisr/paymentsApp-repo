import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
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
    return this.apiUserServer.userDetailsB.pipe(
      map((res) => {
        if (res) {
          return true;
        } else {
          this.router.navigateByUrl('/user-details', { replaceUrl: true });
        }
      })
    )
  }

  //     return this.apiUserServer.isUserHasDetails.pipe(
  //       filter((val) => val !== null), // Filter out initial Behaviour subject value
  //       take(1), // Otherwise the Observable doesn't complete!
  //       map((isUserHasDetails) => {
  //         console.log('intro');
  //         if (isUserHasDetails) {
  //           // Directly open inside area
  //           console.log(isUserHasDetails);
  //           return true;
  //         } else {
  //           console.log('now intro');
  //           console.log(isUserHasDetails);
  //           this.router.navigateByUrl('/user-details', { replaceUrl: true });
  //            return false;
  //         }
  //       })
  //     );
  //   }
  // }
}
