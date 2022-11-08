import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { UserInfoService } from '../services/user-info.service';
import { NavigateHlperService } from '../services/utils/navigate-hlper.service';
import { UtilsService } from '../services/utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class DebtsGuard implements CanLoad {
  constructor(
    private utils: UtilsService,
    private userInfoService:UserInfoService,
    private navigateService: NavigateHlperService
  ) {}
  canLoad(): Observable<boolean> {
    return this.userInfoService.debtCheck$.pipe(
      filter((val) => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map((debtCheck) => {
        // console.log(debtCheck)
        if (debtCheck) {
            // this.utils.presentModal('נסיעות שלא שולמו', 'יש לעדכן את  פרטי האשראי', '',true);
            // setTimeout(() => {
            //   // this.utils.dismissModal();
            // }, 1000);
          this.navigateService.goToHistory();
        } else {
          return true;
        }
      })
    );
  }
}
