import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonDatetime, IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-credit-card-details',
  templateUrl: './credit-card-details.page.html',
  styleUrls: ['./credit-card-details.page.scss'],
})
export class CreditCardDetailsPage implements OnInit {
  @ViewChild(IonDatetime) dateTime: IonDatetime;
  showPicker:boolean = false;
  date:string = '';
  cardNum:string = '';
  cvsNum:string = '';
  cardDate:string = '';
  flipClass:string = '';
  userName:string = '';
  creditCardForm:boolean = true;
  public cardDetails: FormGroup;
  constructor(
    private logInServer: LoginService,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
    public navCtrl: NavController
  ) {

    this.platform.backButton.subscribeWithPriority(10, () => {
      this.routerOutlet.pop()
      this.navCtrl.navigateRoot(['/intro'],{replaceUrl:true})
      // this.router.navigate(['/intro']);
    });
  }
  get firstName(){
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
  onWillDismiss() {
    this.dateTime.confirm(true);
  }
  dataChange(value:string):void {
    const year = value.split('-')[0];
    const month = value.split('-')[1];
    this.date = month + '/' + year;
    this.cardDate = month + '/' + year;
  }
  close():void {
    this.dateTime.cancel(true);
  }
  select():void {
    this.dateTime.confirm(true);
  }
  async updateCreditCard(): Promise<void> {
    this.logInServer.updateCreditCard(this.cardDetails.value).then(async () => {
      this.goToUserProfile();
    });
  }

  cardNumKeyUp(e:Event) {
    this.cardNum = (e.target as HTMLInputElement).value;
  }
  cardCvsKeyUp(e:Event) {
    this.cvsNum = (e.target as HTMLInputElement).value;
  }
  userNameKeyUp(e:Event) {
    this.userName = (e.target as HTMLInputElement).value;
  }
  cvSInputFocus() {
    this.flipClass = 'flip';
  }
  cvSInputUnFocus() {
    this.flipClass = '';
  }
  goToUserProfile():void{

    this.navCtrl.navigateRoot(['intro'],{replaceUrl:true})
   
  }
}
