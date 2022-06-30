import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonDatetime, LoadingController } from '@ionic/angular';
import { from } from 'rxjs';
import { UserLoginService } from '../../services/api/user-login.service';

@Component({
  selector: 'app-credit-card-details',
  templateUrl: './credit-card-details.page.html',
  styleUrls: ['./credit-card-details.page.scss'],
})
export class CreditCardDetailsPage implements OnInit {
  @ViewChild(IonDatetime)dateTime: IonDatetime;
  showPicker =false;
  date ='';
  cardNum='';
  cvsNum='';
  cardDate='';
  flipClass='';
  userName='';
  creditCardForm=true;
  public cardDetails: FormGroup;
  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private apiUserServer: UserLoginService,
    private router: Router,
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
      cardNum: new FormControl(null, [Validators.required ]),
      csvNum: new FormControl(null, [Validators.required,Validators.maxLength(3),Validators.minLength(3)]),
      date: new FormControl(null, [Validators.required]),
      userId: new FormControl(null, [Validators.required]),
      userName: new FormControl(null, [Validators.required]),
    });
  }
  onWillDismiss(ev){
  this.dateTime.confirm(true);
  }
  dataChange(value){
    const year=value.split('-')[0];
    const month=value.split('-')[1];
    this.date=month+'/'+year;
    this.cardDate=month+'/'+year;
  }
  close(){
   this.dateTime.cancel(true);
  }
  select(){
    this.dateTime.confirm(true);
  }
  async updateCreditCard() {
    from(this.apiUserServer.updateCreditCard(this.cardDetails.value)).subscribe(
      async (res) => {
        this.getCreditCardInfo();

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
  async getCreditCardInfo() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.apiUserServer.creditCardDetails.subscribe(
      async (rs) => {
        await loading.dismiss();
        // this.cardDetails.setValue({
        //   firstName: this.apiUserServer.userDetails.value.firstName || '',
        //   lastName: this.apiUserServer.userDetails.value.lastName || '',
        //   email: this.apiUserServer.userDetails.value.email || '',
        // });
        this.router.navigateByUrl('/menu', { replaceUrl: true });
        console.log(this.apiUserServer.creditCardDetails.value);
        console.log(rs);
      },
      async (rs) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Update failed',
          message: rs.error.error.errorMessage['en-us'],
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }
  cardNumKeyUp(e){
console.log(e.target.value);
this.cardNum=e.target.value;
  }
  cardCvsKeyUp(e){
console.log(e.target.value);
this.cvsNum=e.target.value;
  }
  userNameKeyUp(e){
    this.userName=e.target.value;
  }
//   cardDateKeyUp(e){
// console.log(e.target.value);
// this.cardDate=e.target.value;
//   }
cvSInputFocus(){
  this.flipClass='flip';
}
cvSInputUnFocus(){
  this.flipClass='';
}
goToUserProfile(){
  this.router.navigate(['/menu/user-profile']);
}
}
