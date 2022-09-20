import { Component } from '@angular/core';
import { App } from '@capacitor/app';
import { NavController, Platform } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
const HOTEL_ID = 'my-hotel';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage {
  headerText: string;

  constructor(
    private storageService: StorageService,
    private platform: Platform,
    private navCtrl: NavController
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateBack('/info', { replaceUrl: true });
    });
  }

  ionViewWillEnter(): void {
    this.getHotel();
  }
  onClick(): void {
    this.navCtrl.navigateRoot(['/scan'], { replaceUrl: true });
  }
  async getHotel(): Promise<void> {
    const hotel = (await this.storageService.getStorege(HOTEL_ID)).value;
    console.log(hotel);
    this.headerText = hotel == '0' ? '' : hotel;
  }
}
