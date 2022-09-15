import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { LoginService } from '../services/login.service';
import { AuthenticationService } from '../services/authentication.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AutoLoginGuard implements CanLoad {
  constructor(
    private logInServer: LoginService,
    private authenticationService: AuthenticationService,
    public navCtrl: NavController
  ) {}

  canLoad(): Observable<boolean> {
    return this.authenticationService.isAuthenticated.pipe(
      filter((val) => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map((isAuthenticated) => {
        console.log(isAuthenticated);
        if (isAuthenticated) {
          // Directly open inside area
          this.navCtrl.navigateRoot(['/intro'],{replaceUrl:true})
          // this.router.navigate(['/intro']);
        } else {
          // Simply allow access to the login
          return true;
        }
      })
    );
  }
}
