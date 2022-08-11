import { Component, ViewChild } from '@angular/core';
import {
  AlertController,
  IonRouterOutlet,
  NavController,
  Platform,
} from '@ionic/angular';
import { GetResult, Storage } from '@capacitor/storage';
import { Router } from '@angular/router';

import { App } from '@capacitor/app';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StorageService } from 'src/app/services/storage.service';

const HOTEL_ID = 'my-hotel';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage {
 
  prefersDark;
  userDetalis: object;
  mapOptions: google.maps.MapOptions = {
    center: { lat: 31.79476, lng: 35.18761 },
    zoom: 16,
  };
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private storageService: StorageService,
    private alertController: AlertController,
    private routerOutlet: IonRouterOutlet,
    private platform: Platform,
    public navCtrl: NavController
  ) {
    // this.platform.backButton.subscribeWithPriority(-1, () => {
      
    //     App.exitApp();
   
    // });
  
    document.querySelector('body').classList.remove('scanBg');
  }

  ngAfterViewInit(): void {
    this.hideSplashScreen();
  }
  async hideSplashScreen() {}
  settings() {
    // this.router.navigate(['/settings']);
    this.navCtrl.navigateRoot(['settings'],{replaceUrl:true})
    // this.router.navigate(['/settings']);
  }
  scan() {
    // this.router.navigate(['/scan']);
    this.navCtrl.navigateRoot(['scan'],{replaceUrl:true})
  }
  map() {
    // this.router.navigate(['/travel-route-tracking']);
    this.navCtrl.navigateRoot(['travel-route-tracking'],{replaceUrl:true})
    // this.router.navigate(['/payment']);
  }
  logOut() {
    Storage.remove({ key: HOTEL_ID });
    // this.router.navigate(['/intro']);
    this.navCtrl.navigateRoot(['intro'],{replaceUrl:true})
    // this.storageService.deleteStorege();
    // this.authenticationService.isAuthenticated.next(false);
    // window.location.reload();
  }

  userProfile() {
    // this.router.navigate(['/user-profile']);
    this.navCtrl.navigateRoot(['user-profile'],{replaceUrl:true})
    // this.router.navigate(['/user-profile']);
  }
  creditCardDetails() {
    // this.router.navigate(['/credit-card-details']);
    this.navCtrl.navigateRoot(['credit-card-details'],{replaceUrl:true})
    // this.router.navigate(['/credit-card-details']);
  }
  toggleDarkTheme(matchesMode) {
    this.prefersDark = matchesMode;
  }
  async showAlert(message) {
    const alert = await this.alertController.create({
      header: 'מיקום כבוי',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Ok',
          handler: () => {
            App.exitApp();
          },
        },
      ],
    });
    await alert.present();
  }
}
