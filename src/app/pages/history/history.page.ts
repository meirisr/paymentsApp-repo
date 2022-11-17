import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { UserInfoService } from 'src/app/services/user-info.service';
import { NavigateHlperService } from 'src/app/services/utils/navigate-hlper.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  private subscriptions: Subscription[] = [];
  historyCards: any[] = [];
  historyCardsIds: any[] = [];
  selectValue:string='month';

  constructor(
    private plt: Platform,
    private userInfoServer: UserInfoService,
    private navigateService: NavigateHlperService,
    private utils: UtilsService
  ) {
    this.plt.backButton.subscribeWithPriority(10, () => {
      this.navigateService.goToMenu();
    });
  }

  ngOnInit() {
    // const loader=  this.utils.presentEndOfTripModal("אבירים פינת יעקב אליאב 5, ירושלים","מלון כרמים ירושלים , הגן הזאולוגי 7");
   this.getHistoryData('month')
  }
  goToMenu(): void {
    this.navigateService.goToMenu();
  }
  
  tripPay() {
    this.userInfoServer.historyTripPay$.next(null);
    this.navigateService.goToCCDetails();
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
    const h= date.getHours();
    const m= date.getMinutes();
    return h + ":" + m;
  }
  handleChange(e){
    this.selectValue=e.target.value
    this.getHistoryData(e.target.value)
    console.log(e.target.value)
  }
  getHistoryData(after:string){
    let userInfo$ = this.userInfoServer.getUserHistory(after).subscribe(
      (data) => {
        console.log(data)
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
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
