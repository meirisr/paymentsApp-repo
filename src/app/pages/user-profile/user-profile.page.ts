import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  userDetails: any;
  firstName: string;
  lastName: string;
  email: string;
  cardNum: string;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
    public navCtrl: NavController

    
  ) {
    this.platform.backButton.subscribeWithPriority (0, () => {
    // this.routerOutlet.pop()
    //   this.router.navigate(['/menu']);
    this.navCtrl.navigateRoot(['menu'],{replaceUrl:true})
    });
  }

  ionViewDidEnter() {
    this.getUserInfo();
    this.getcardInfo();
  }
  ngOnInit() {}

  goToUserDetails() {
    this.navCtrl.navigateRoot(['user-details'],{replaceUrl:true})
    // this.router.navigate(['/user-details']);
  }
  cardDetails() {
    this.navCtrl.navigateRoot(['credit-card-details'],{replaceUrl:true})
    // this.router.navigate(['/credit-card-details']);
  }
  async getUserInfo() {
    this.userDetails = await JSON.parse(
      (await this.storageService.getUserDetails()).value
    );
    this.firstName =
      // this.storageService?.userDetails?.firstName ||
      this.userDetails?.firstName || '';
    this.lastName =
      // this.storageService?.userDetails?.lastName ||
      this.userDetails?.lastName || '';
    this.email =
      // this.storageService?.userDetails?.email ||
      this.userDetails?.email || '';
  }

  async getcardInfo() {
    let creditCardDetails = await (
      await this.storageService.getCreditCard4Dig()
    ).value;
    this.cardNum = creditCardDetails != null ? '****' + creditCardDetails : '';
  }
  goToMenu() {
    this.navCtrl.navigateRoot(['menu'],{replaceUrl:true})
    // this.router.navigate(['/menu']);
  }
}
