import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonDatetime, IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-credit-card-details',
  templateUrl: './credit-card-details.page.html',
  styleUrls: ['./credit-card-details.page.scss'],
})
export class CreditCardDetailsPage implements OnInit {
  @ViewChild(IonDatetime) dateTime: IonDatetime;
  showPicker = false;
  date = '';
  cardNum = '';
  cvsNum = '';
  cardDate = '';
  flipClass = '';
  userName = '';
  creditCardForm = true;
  public cardDetails: FormGroup;
  constructor(
    private logInServer: LoginService,
    private router: Router,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
    public navCtrl: NavController
  ) {

    this.platform.backButton.subscribeWithPriority(0, () => {
      this.routerOutlet.pop()
      this.navCtrl.navigateRoot(['intro'],{replaceUrl:true})
      // this.router.navigate(['/intro']);
    });
  }
  get firstName() {
    return this.cardDetails.get('firstName');
  }
  get lastName() {
    return this.cardDetails.get('lastName');
  }
  get email() {
    return this.cardDetails.get('email');
  }

  ngOnInit() {
    this.cardDetails = new FormGroup({
      cardNum: new FormControl(null, [Validators.required]),
      csvNum: new FormControl(null, [
        Validators.required,
        Validators.maxLength(3),
        Validators.minLength(3),
      ]),
      date: new FormControl(null, [Validators.required]),
      userId: new FormControl(null, [Validators.required]),
      userName: new FormControl(null, [Validators.required]),
    });
  }
  onWillDismiss(ev) {
    this.dateTime.confirm(true);
  }
  dataChange(value) {
    const year = value.split('-')[0];
    const month = value.split('-')[1];
    this.date = month + '/' + year;
    this.cardDate = month + '/' + year;
  }
  close() {
    this.dateTime.cancel(true);
  }
  select() {
    this.dateTime.confirm(true);
  }
  async updateCreditCard() {
    this.logInServer.updateCreditCard(this.cardDetails.value).then(async () => {
      this.goToUserProfile();
    });
  }

  cardNumKeyUp(e) {
    this.cardNum = e.target.value;
  }
  cardCvsKeyUp(e) {
    this.cvsNum = e.target.value;
  }
  userNameKeyUp(e) {
    this.userName = e.target.value;
  }
  cvSInputFocus() {
    this.flipClass = 'flip';
  }
  cvSInputUnFocus() {
    this.flipClass = '';
  }
  goToUserProfile() {
    // this.router.navigate(['/intro'])
    this.navCtrl.navigateRoot(['intro'],{replaceUrl:true})
    // this.router.navigate(['/user-profile']);
  }
}
