import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot,  CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { TravelProcessService } from '../services/travel-process.service';
import { NavigateHlperService } from '../services/utils/navigate-hlper.service';

@Injectable({
  providedIn: 'root'
})
export class ActiveRouteGuard implements CanLoad {
  constructor(
    private navigateService: NavigateHlperService,
    private travelProcessService: TravelProcessService
  ) {}
  
  canLoad(): Observable<boolean> {
    return this.travelProcessService.routeInfo.pipe(
      filter((val) => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map((isActiveRoute) => {
     
        if (isActiveRoute) {
          this.navigateService.goToMenu();
        } else {
          return true;
        }
      })
    );
  }
}
