import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonDatetime, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { UserInfoService } from 'src/app/services/user-info.service';
import { NavigateHlperService } from 'src/app/services/utils/navigate-hlper.service';

@Component({
  selector: 'app-history-pay',
  templateUrl: './history-pay.page.html',
  styleUrls: ['./history-pay.page.scss'],
})
export class HistoryPayPage implements OnInit {
  private subscriptions: Subscription[] = [];
  @ViewChild(IonDatetime) dateTime: IonDatetime;
  tripInfo = null;
  showPicker: boolean = false;
  date: string = '';
  cardNum: string = '';
  cvsNum: string = '';
  cardDate: string = '';
  flipClass: string = '';
  userName: string = '';
  creditCardForm: boolean = true;
  public cardDetails: FormGroup;
  constructor(
    private userInfoServer: UserInfoService,
    private platform: Platform,
    private alertController: AlertController,
    private navigateService: NavigateHlperService
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navigateService.goToHistory();

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
    const date_regex = /^(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    let tripInfo$ = this.userInfoServer.historyTripPay$.subscribe(
      (data) => {
        this.tripInfo = data;
      },
      (err) => {
        console.log(err);
      }
    );
    this.subscriptions.push(tripInfo$);
    this.cardDetails = new FormGroup({
      cardNum: new FormControl(null, [Validators.required]),
      csvNum: new FormControl(null, [
        Validators.required,
        Validators.maxLength(3),
        Validators.minLength(3),
      ]),
      date: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(date_regex),
        ])
      ),
      userId: new FormControl(null, [Validators.required]),
      userName: new FormControl(null, [Validators.required]),
    });
  }
  onWillDismiss() {
    this.dateTime.confirm(true);
  }
  dataChange(value: string): void {
    const year = value.split('-')[0];
    const month = value.split('-')[1];
    this.date = month + '/' + year;
    this.cardDate = month + '/' + year;
  }
  close(): void {
    this.dateTime.cancel(true);
  }
  select(): void {
    this.dateTime.confirm(true);
  }
  async updateCreditCard(): Promise<void> {
    this.userInfoServer.tripPayment(this.cardDetails.value).subscribe(
      (data) => {
  
        this.showalert(data.responseMessage);
        this.goToHistory();
      },
      (err) => console.log(err)
    );
  }

  cardNumKeyUp(e: Event) {
    this.cardNum = (e.target as HTMLInputElement).value;
  }
  cardCvsKeyUp(e: Event) {
    this.cvsNum = (e.target as HTMLInputElement).value;
  }
  userNameKeyUp(e: Event) {
    this.userName = (e.target as HTMLInputElement).value;
  }
  cvSInputFocus() {
    this.flipClass = 'flip';
  }
  cvSInputUnFocus() {
    this.flipClass = '';
  }
  goToHistory(): void {
    this.navigateService.goToHistory();
  }
  formatDate(item) {
    if (!item) return;
    let date = new Date(item.created);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return day + '.' + month + '.' + year;
  }
  async showalert(e) {
    const alert = await this.alertController.create({
      header: '',
      message: e,
    });
    await alert.present();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
