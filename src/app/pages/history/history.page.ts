import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { UserInfoService } from 'src/app/services/user-info.service';
import { NavigateHlperService } from 'src/app/services/utils/navigate-hlper.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  private subscriptions: Subscription[] = [];
  historyCards:[]=[];
  constructor(
    private plt: Platform,
    private userInfoServer:UserInfoService,
    private navigateService: NavigateHlperService
  ) {
    this.plt.backButton.subscribeWithPriority(10, () => {
      this.navigateService.goToMenu();
    });
  }

  ngOnInit() {
    let userInfo$=this.userInfoServer.getUserHistory().subscribe((data)=>{
      this.historyCards=data;
      console.log(data)
    },
    (err)=>console.log(err))
    this.subscriptions.push(userInfo$)
  }
  goToMenu(): void {
    this.navigateService.goToMenu();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
