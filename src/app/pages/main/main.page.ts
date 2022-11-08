import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import {
  StorageService,
  userStoregeObj,
} from 'src/app/services/storage.service';
import { TravelProcessService } from 'src/app/services/travel-process.service';
import { UserInfoService } from 'src/app/services/user-info.service';
import { NavigateHlperService } from 'src/app/services/utils/navigate-hlper.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage {
  private subscriptions: Subscription[] = [];
  headerText: string;
  noData: boolean = false;

  constructor(
    private storageService: StorageService,
    private navigateService: NavigateHlperService,
    private travelProcessService: TravelProcessService,
    private userInfoServer: UserInfoService,
    private utils: UtilsService,
    private platform: Platform
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navigateService.goToIntro();
    });
  }
  ngOnInit() {
    this.noData = false;
  }

  ionViewWillEnter(): void {
    this.getHotel();
  }
  ngAfterViewInit(): void {
    let routeInfoSubscription = this.travelProcessService.paymentTrip.subscribe(
      async (data) => {
        if (!data) {
          this.noData = true;
          return;
        }
        this.noData = false;
      },
      async (error) => {
        console.log(error);
      }
    );
    this.subscriptions.push(routeInfoSubscription);
  }
  async onClick() {
    if (this.userInfoServer.isCardHasDetails.value) {
      this.navigateService.goToScan();
    } else {
      await this.utils.presentModal('', 'עליך להכניס פרטי אשראי', '');
      setTimeout(() => {
        this.utils.dismissModal();
      }, 2000);
      this.navigateService.goToCCDetails();
    }
  }
  onActiveTrip(): void {
    this.navigateService.goToTravelRouteTracking();
  }
  async getHotel(): Promise<void> {
    const hotel = (
      await this.storageService.getStorege(userStoregeObj.HOTEL_NAME)
    ).value;
    // console.log(hotel);
    if (hotel) this.headerText = hotel;
    // this.headerText = hotel == '0' ? '' : hotel;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
