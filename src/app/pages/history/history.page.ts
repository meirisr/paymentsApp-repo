import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  constructor( private plt: Platform, public navCtrl: NavController) {
    this.plt.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateBack('/menu', { replaceUrl: true });
    });
   }

  ngOnInit() {
  }

}
