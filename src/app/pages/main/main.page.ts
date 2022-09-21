import { Component } from '@angular/core';
import {Platform } from '@ionic/angular';
import { StorageService,userStoregeObj } from 'src/app/services/storage.service';
import { NavigateHlperService } from 'src/app/services/utils/navigate-hlper.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage {
  headerText: string;

  constructor(
    private storageService: StorageService,
    private navigateService: NavigateHlperService,
    private platform: Platform,
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navigateService.goToIntro()
    });
  }

  ionViewWillEnter(): void {
    this.getHotel();
  }
  onClick(): void {
    this.navigateService.goToScan()
  }
  async getHotel(): Promise<void> {
    const hotel = (await this.storageService.getStorege(userStoregeObj.HOTEL_ID)).value;
    console.log(hotel);
    this.headerText = hotel == '0' ? '' : hotel;
  }
}
