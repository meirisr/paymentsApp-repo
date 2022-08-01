import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertController,
  IonDatetime,
  ModalController,
  NavController,
} from '@ionic/angular';
import { from } from 'rxjs';
import { LoginStepsNavbarComponent } from 'src/app/components/login-steps-navbar/login-steps-navbar.component';
import { LoginService } from 'src/app/services/login.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
})
export class UserDetailsPage implements OnInit {
  @ViewChild(IonDatetime) dateTime: IonDatetime;
  date = '';
  public userDetails: FormGroup;
  constructor(
    private alertController: AlertController,
    private logInServer: LoginService,
    private storageService: StorageService,
    private router: Router,
    private modalController: ModalController,
    private nav: NavController
  ) {}
  get firstName() {
    return this.userDetails.get('firstName');
  }
  get lastName() {
    return this.userDetails.get('lastName');
  }
  get email() {
    return this.userDetails.get('email');
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
  ionViewWillEnter() {
    this.getuserInfo();
  }

  async updateUserInfo() {
    from(this.logInServer.updateUserInfo(this.userDetails.value)).subscribe(
      async (res) => {
        this.getuserInfo().then(() => {
          this.goToUserProfile();
        });
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
  }
  async getuserInfo() {
    let userDetails = JSON.parse(
      await await (
        await this.storageService.getUserDetails()
      ).value
    );

    this.userDetails.setValue({
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      userId: '',
      userDate: 'DD/MM/YY',
      email: userDetails.email,
    });
  }
  goToUserProfile() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/user-profile']);
    // this.router.navigate(['/user-profile']);
  }
  goToMenu() {
    this.router.navigate(['/menu']);
  }
  onWillDismiss(ev) {
    this.dateTime.confirm(true);
  }
  dataChange(value) {
    const year = value.split('-')[0];
    const month = value.split('-')[1];
    const day = value.split('-')[2].split('T')[0];
    this.date = day + '/' + month + '/' + year;
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: LoginStepsNavbarComponent,
      cssClass: 'my-custom-class',
      swipeToClose: true,
    });
    return await modal;
  }
}
