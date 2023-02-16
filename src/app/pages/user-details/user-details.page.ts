import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonDatetime, Platform } from '@ionic/angular';
import { from, Subscription } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';
import { UserInfoService } from 'src/app/services/user-info.service';
import { NavigateHlperService } from 'src/app/services/utils/navigate-hlper.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
})
export class UserDetailsPage implements OnInit {
  private subscriptions: Subscription[] = [];
  @ViewChild(IonDatetime) dateTime: IonDatetime;
  date: string = '';
  public userDetails: FormGroup;
  constructor(
    private alertController: AlertController,
    private storageService: StorageService,
    private router: Router,
    private userInfoServer: UserInfoService,
    private platform: Platform,
    private navigateService: NavigateHlperService
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goToMenu();
    });
  }
  ngOnInit() {
    this.userDetails = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      userId: new FormControl(null, []),
      userDate: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }
  ionViewWillEnter(): void {
    this.getuserInfo();
  }

  async updateUserInfo(): Promise<void> {
   let updateUserInfo$= from(this.userInfoServer.updateUserInfo(this.userDetails.value)).subscribe(
      async () => {
        let userDetailsSubscription$ = this.userInfoServer.userDetails.subscribe(
          (data) => {
            this.userDetails.setValue({
              firstName: data.firstName,
              lastName: data.lastName,
              userId: '',
              userDate: 'DD/MM/YY',
              email: data.email,
            });
          }
        );
        this.subscriptions.push(userDetailsSubscription$);
      },
      
      async (res) => {
        const alert = await this.alertController.create({
          header: 'Update failed',
          message: res.error.error.errorMessage['en-us'],
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
    this.subscriptions.push(updateUserInfo$);
  }
  async getuserInfo(): Promise<void> {
   
    let userDetails = JSON.parse(
      (await this.storageService.getUserDetails()).value
    );

    this.userDetails.setValue({
      firstName: userDetails?.firstName??'',
      lastName: userDetails?.lastName??"",
      userId: '',
      userDate: 'DD/MM/YY',
      email: userDetails?.email??"",
    });

  }
  goToUserProfile(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.navigateService.goToUserProfile();
  }
  goToMenu(): void {
    this.navigateService.goToMenu();
  }
  onWillDismiss(): void {
    this.dateTime.confirm(true);
  }
  close(): void {
    this.dateTime.cancel(true);
  }
  select(): void {
    this.dateTime.confirm(true);
  }
  dataChange(value: string) {
    const year = value.split('-')[0];
    const month = value.split('-')[1];
    const day = value.split('-')[2].split('T')[0];
    this.date = day + '/' + month + '/' + year;
  }
  onCancel(){
    this.goToMenu()
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
  // async presentModal(): Promise<HTMLIonModalElement> {
  //   const modal = await this.modalController.create({
  //     component: LoginStepsNavbarComponent,
  //     cssClass: 'my-custom-class',
  //     swipeToClose: true,
  //   });
  //   return await modal;
  // }
}
