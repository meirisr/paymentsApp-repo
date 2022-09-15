import { LoginService } from '../services/login.service';
import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { UtilsService } from '../services/utils/utils.service';
import { AuthenticationService } from '../services/authentication.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    public navCtrl: NavController
  ){}
  canLoad(): Observable<boolean> {
    return this.authenticationService.isAuthenticated.pipe(
      filter((val) => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true;
        } else {
          this.navCtrl.navigateRoot(['/login'],{replaceUrl:true})
          return false;
        }
      })
    );
  }
}
