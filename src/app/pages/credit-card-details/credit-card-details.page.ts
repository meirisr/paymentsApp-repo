import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonDatetime, LoadingController } from '@ionic/angular';
import { from } from 'rxjs';
import { UserLoginService } from 'src/app/services/api/user-login.service';

@Component({
  selector: 'app-credit-card-details',
  templateUrl: './credit-card-details.page.html',
  styleUrls: ['./credit-card-details.page.scss'],
})
export class CreditCardDetailsPage implements OnInit {
  @ViewChild(IonDatetime)dateTime: IonDatetime;
  showPicker =false;
  date ='';
  public cardDetails: FormGroup;
  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private apiUserServer: UserLoginService
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
    });
  }
  onWillDismiss(ev){
  this.dateTime.confirm(true);
  }
  dataChange(value){
    const year=value.split('-')[0];
    const month=value.split('-')[1];
    this.date=month+'/'+year;
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
}
