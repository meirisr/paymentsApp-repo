import { Injectable } from '@angular/core';
import { CanLoad, Router} from '@angular/router';
import { Storage } from '@capacitor/storage';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { UserLoginService } from '../services/api/user-login.service';

export const INTRO_KEY='intro-seen';

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {
  constructor(private router: Router , private apiUserServer: UserLoginService,){
    // console.log("ggggg")
  };
   canLoad(): Observable<boolean>{
      return this.apiUserServer.isUserHasDetails.pipe(
        filter((val) => val !== null), // Filter out initial Behaviour subject value
        take(1), // Otherwise the Observable doesn't complete!
        map((isUserHasDetails) => {
          console.log(' login');
          if (isUserHasDetails) {
            return true;
          } else {
            this.router.navigateByUrl('/user-details', { replaceUrl: true });
             return true;
          }
        })
      )

  }
}
