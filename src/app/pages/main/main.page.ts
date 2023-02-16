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
  historyCards: any[] = [];
  historyCardsIds: any[] = [];
  selectValue: string = 'all';
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
    this.getHistoryData(this.selectValue);
      // let routeInfoSubscription = this.travelProcessService.paymentTrip.subscribe(
      //   async (data) => {
      //     console.log(data)
         
      //     if (data){
      //       this.navigateService.goToTravelRouteTracking();
            
      //     }
      //   },
      //   async (error) => {
      //     console.log(error);
      //   }
      // );
      // this.subscriptions.push(routeInfoSubscription);
  
  
    
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
    this.navigateService.goToScan();
    // if (!this.noData) {
    //   this.navigateService.goToTravelRouteTracking();
    // } else {
    //   this.navigateService.goToScan();
    // }
    // if (this.userInfoServer.isCardHasDetails.value) {
    //   this.navigateService.goToScan();
    // } else {
    //   await this.utils.presentModal('', 'עליך להכניס פרטי אשראי', '');
    //   setTimeout(() => {
    //     this.utils.dismissModal();
    //   }, 2000);
    //   this.navigateService.goToCCDetails();
    // }
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


  getHistoryData(after: string) {
    let userInfo$ = this.userInfoServer.getUserHistory(after).subscribe(
      (data) => {
        this.historyCards = data.reverse();
        data.forEach((trip) => {
          !trip.paymentCompleted
            ? this.historyCardsIds.push(trip.id.toString())
            : null;
        });
      },
      (err) => {
        this.utils.showalert(err, '');
        console.log(err);
      }
    );
    this.subscriptions.push(userInfo$);
  }
  formatDate(item) {
    let date = new Date(item.created);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return day + '.' + month + '.' + year;
  }
  formatTime(item) {
    let date = new Date(item.created);
    const h = date.getHours();
    const m = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
    return h + ':' + m;
  }
  handleChange(e) {
    this.selectValue = e.target.value;
    this.getHistoryData(e.target.value);
    console.log(e.target.value);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
