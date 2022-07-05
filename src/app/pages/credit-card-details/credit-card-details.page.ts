import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonDatetime } from '@ionic/angular';
import { from } from 'rxjs';
import { UserLoginService } from '../../services/api/user-login.service';

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
    private apiUserServer: UserLoginService,
    private router: Router
  ) {}
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
    from(this.apiUserServer.updateCreditCard(this.cardDetails.value)).subscribe(
      async (res) => {
        this.apiUserServer.handleButtonClick();
        from(this.apiUserServer.getCreditCardInfo()).subscribe(
          async (res) => {},
          async (res) => {
            this.apiUserServer.onHttpErorr(res, '');
          }
        );
      },
      async (res) => {
        this.apiUserServer.onHttpErorr(res, '');
      }
    );
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
  //   cardDateKeyUp(e){
  // console.log(e.target.value);
  // this.cardDate=e.target.value;
  //   }
  cvSInputFocus() {
    this.flipClass = 'flip';
  }
  cvSInputUnFocus() {
    this.flipClass = '';
  }
  goToUserProfile() {
    this.router.navigate(['/user-profile']);
  }
}
