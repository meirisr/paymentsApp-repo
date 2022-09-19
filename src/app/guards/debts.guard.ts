import { Injectable } from '@angular/core';
import { CanLoad} from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DebtsGuard implements CanLoad {
  constructor(
    private authenticationService: AuthenticationService,
    public navCtrl: NavController
  ){}
  canLoad(): Observable<boolean> {
    return this.authenticationService.debtCheck$.pipe(
      filter((val) => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map((debtCheck) =>{
        if (debtCheck) {
          this.navCtrl.navigateRoot(['/history'],{replaceUrl:true})
        } else {
      
          return true;
        }
      })
    );
  }
}
