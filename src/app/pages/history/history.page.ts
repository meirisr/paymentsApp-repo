import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NavigateHlperService } from 'src/app/services/utils/navigate-hlper.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  constructor(
    private plt: Platform,
    private navigateService: NavigateHlperService
  ) {
    this.plt.backButton.subscribeWithPriority(10, () => {
      this.navigateService.goToMenu();
    });
  }

  ngOnInit() {}
  goToMenu(): void {
    this.navigateService.goToMenu();
  }
}
