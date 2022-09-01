import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage {
  private subscriptions: Subscription[] = [];
  userDetails: any;
  firstName: string;
  lastName: string;
  email: string;
  cardNum: string;

  constructor(
    private storageService: StorageService,
    private platform: Platform,
    public navCtrl: NavController,
    private logInServer: LoginService
  ) {
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.navCtrl.navigateRoot(['menu'], { replaceUrl: true });
    });
  }
  ionViewWillEnter(): void {
    this.getUserInfo();
  }
  ionViewDidEnter(): void {
    this.getcardInfo();
  }

  goToUserDetails(): void {
    this.navCtrl.navigateRoot(['user-details'], { replaceUrl: true });
  }
  cardDetails(): void {
    this.navCtrl.navigateRoot(['credit-card-details'], { replaceUrl: true });
  }
  async getUserInfo(): Promise<void> {
    let userDetailsSubscription = this.logInServer.userDetails.subscribe(
      (data) => {
        this.firstName = data?.firstName || '';
        this.lastName = data?.lastName || '';
        this.email = data?.email || '';
      }
    );
    this.subscriptions.push(userDetailsSubscription);
    this.userDetails = JSON.parse(
      (await this.storageService.getUserDetails()).value
    );
    this.storageService.userDetails;

    this.firstName = this.userDetails?.firstName || '';
    this.lastName = this.userDetails?.lastName || '';
    this.email = this.userDetails?.email || '';
  }

  async getcardInfo(): Promise<void> {
    let creditCardDetails = await (
      await this.storageService.getCreditCard4Dig()
    ).value;
    this.cardNum = creditCardDetails != null ? '****' + creditCardDetails : '';
  }
  goToMenu(): void {
    this.navCtrl.navigateRoot(['menu'], { replaceUrl: true });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
