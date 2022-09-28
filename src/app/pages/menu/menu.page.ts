import { Component } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { userStoregeObj } from 'src/app/services/storage.service';
import { Storage } from '@capacitor/storage';
import { App } from '@capacitor/app';
import { NavigateHlperService } from 'src/app/services/utils/navigate-hlper.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})

export class MenuPage {
  prefersDark: string;
  userDetalis: object;
  isrLogo: string = '../../../assets/images/isrLogo.png';
  mapOptions: google.maps.MapOptions = {
    center: { lat: 31.79476, lng: 35.18761 },
    zoom: 16,
  };
  constructor(
    private alertController: AlertController,
    private platform: Platform,
    private navigateService: NavigateHlperService,
    public navCtrl: NavController
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateBack('/info', { replaceUrl: true });
    });

    document.querySelector('body').classList.remove('scanBg');
  }

  ngAfterViewInit(): void {
    this.hideSplashScreen();
  }
  async hideSplashScreen(): Promise<void> {}

  settings(): void {
    this.navigateService.goToSettings();
  }
  scan(): void {
    this.navigateService.goToScan();
  }
  map(): void {
    this.navigateService.goToTravelRouteTracking();
  }
  history(): void {
    this.navigateService.goToHistory();
  }
  logOut(): void {
    Storage.remove({ key: userStoregeObj.HOTEL_ID });
    this.navigateService.goToIntro();
  }

  userProfile(): void {
    this.navigateService.goToUserProfile();
  }
  creditCardDetails(): void {
    this.navigateService.goToCCDetails();
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
