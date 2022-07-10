import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { UserLoginService } from '../services/api/user-login.service';

@Injectable({
  providedIn: 'root',
})
export class AutoLoginGuard implements CanLoad {
  constructor(
    private apiUserServer: UserLoginService,
    private router: Router
  ) {}

  canLoad(): Observable<boolean> {
    return this.apiUserServer.isAuthenticated.pipe(
      filter((val) => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map((isAuthenticated) => {
        
        if (isAuthenticated) {
          // Directly open inside area
          this.router.navigateByUrl('/menu', { replaceUrl: true });
        } else {
          // Simply allow access to the login
          return true;
        }
      })
    );
  }
}
