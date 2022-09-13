import { Component } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { App } from '@capacitor/app';

const HOTEL_ID = 'my-hotel';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage {
  prefersDark: string;
  userDetalis: object;
  mapOptions: google.maps.MapOptions = {
    center: { lat: 31.79476, lng: 35.18761 },
    zoom: 16,
  };
  constructor(
    private alertController: AlertController,
    private platform: Platform,
    public navCtrl: NavController
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      navigator['app'].exitApp()
    });

    document.querySelector('body').classList.remove('scanBg');
  }

  ngAfterViewInit(): void {
    this.hideSplashScreen();
  }
  async hideSplashScreen(): Promise<void> {}

  settings(): void {
    this.navCtrl.navigateRoot(['settings'], { replaceUrl: true });
  }
  scan(): void {
    this.navCtrl.navigateRoot(['scan'], { replaceUrl: true });
  }
  map(): void {
    this.navCtrl.navigateRoot(['travel-route-tracking'], { replaceUrl: true });
  }
  history(): void {
    this.navCtrl.navigateRoot(['history'], { replaceUrl: true });
  }
  logOut(): void {
    Storage.remove({ key: HOTEL_ID });
    this.navCtrl.navigateRoot(['intro'], { replaceUrl: true });
  }

  userProfile(): void {
    this.navCtrl.navigateRoot(['user-profile'], { replaceUrl: true });
  }
  creditCardDetails(): void {
    this.navCtrl.navigateRoot(['credit-card-details'], { replaceUrl: true });
  }
  toggleDarkTheme(matchesMode): void {
    this.prefersDark = matchesMode;
  }
  async showAlert(message: string): Promise<void> {
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
