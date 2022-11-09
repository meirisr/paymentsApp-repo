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
    let userInfo$ = this.userInfoServer.getUserHistory().subscribe(
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
  goToMenu(): void {
    this.navigateService.goToMenu();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
  creatHistoryCard(item) {
    return {};
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
}
