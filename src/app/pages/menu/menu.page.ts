import { Component, ViewChild } from '@angular/core';
import { AlertController, IonRouterOutlet, NavController, Platform } from '@ionic/angular';

import { Router } from '@angular/router';

import { App } from '@capacitor/app';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StorageService } from 'src/app/services/storage.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet;
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
    private nav: NavController,
    private platform: Platform,
  ) {
    // this.platform.backButton.subscribeWithPriority(0, () => {
    //   App.exitApp();
    // });
    document.querySelector('body').classList.remove('scanBg');
  }

  ngAfterViewInit(): void {
    this.hideSplashScreen();
  }
  async hideSplashScreen() {}
  settings() {
    this.nav.navigateForward('/settings', { animationDirection: 'forward', animated: true })
    // this.router.navigate(['/settings']);
  }
  scan() {
    this.nav.navigateForward('/scan', { animationDirection: 'forward', animated: true })
  }
  map() {
    this.nav.navigateForward('/travel-route-tracking', { animationDirection: 'forward', animated: true })
    // this.router.navigate(['/payment']);
  }
  logOut() {
     this.nav.navigateBack('/intro',{ replaceUrl: true ,animationDirection: 'back', animated: true });
    // this.storageService.deleteStorege();
    // this.authenticationService.isAuthenticated.next(false);
    // window.location.reload();
  }

  userProfile() {
    this.nav.navigateForward('/user-profile', { animationDirection: 'forward', animated: true })
    // this.router.navigate(['/user-profile']);
  }
  creditCardDetails() {
    this.nav.navigateForward('/credit-card-details', { animationDirection: 'forward', animated: true })
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
