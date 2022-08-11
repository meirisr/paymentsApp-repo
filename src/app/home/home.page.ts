import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from './../services/authentication.service';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private authService: AuthenticationService, private router: Router,    public navCtrl: NavController) {}
  async logout() {
    // await this.authService.logout();
    this.navCtrl.navigateRoot([''],{replaceUrl:true})
    // this.router.navigate(['/']);
  }
}
