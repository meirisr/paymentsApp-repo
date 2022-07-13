import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { NavController, Platform } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
const HOTEL_ID = 'my-hotel';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage {
  headerText: string;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private platform: Platform,
    private nav: NavController
  ) {
    // this.platform.backButton.subscribeWithPriority(10, () => {
    //   App.exitApp();
    // });
  }

  ionViewWillEnter() {
    this.getHotel();
  }
  onClick() {
    // this.router.navigate(['/scan']);
    this.nav.navigateForward('/scan', { animationDirection: 'forward', animated: true })
  }
  async getHotel() {
    const hotel = (await this.storageService.getStorege(HOTEL_ID)).value;
    console.log(hotel);
    this.headerText = hotel == 'null' ? '' : hotel;
  }
}
