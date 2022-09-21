import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { StorageService } from 'src/app/services/storage.service';
import { NavigateHlperService } from 'src/app/services/utils/navigate-hlper.service';

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
    private navigateService: NavigateHlperService,
    private platform: Platform,
    private logInServer: LoginService
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navigateService.goToMenu();
    });
  }
  ionViewWillEnter(): void {
    this.getUserInfo();
  }
  ionViewDidEnter(): void {
    this.getcardInfo();
  }

  goToUserDetails(): void {
    this.navigateService.goToUserDetails();
  }
  cardDetails(): void {
    this.navigateService.goToCCDetails();
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
    this.navigateService.goToMenu();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
