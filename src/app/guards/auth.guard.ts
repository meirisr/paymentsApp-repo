import { UserLoginService } from '../services/api/user-login.service';
import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(
    private apiUserServer: UserLoginService,
    private router: Router
  ) {}
  canLoad(): Observable<boolean> {
    return this.apiUserServer.isAuthenticated.pipe(
      filter((val) => val !== null), // Filter out initial Behaviour subject value
      // take(1), // Otherwise the Observable doesn't complete!
      map((isAuthenticated) => {
        console.log(isAuthenticated);
        if (isAuthenticated) {
          // this.router.navigateByUrl('/menu', { replaceUrl: true });
          return true;
        } else {
          this.router.navigateByUrl('/login');
          return false;
        }
      })
    );
  }
}
