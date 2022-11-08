import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { NavigateHlperService } from 'src/app/services/utils/navigate-hlper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnDestroy {
  @ViewChild('phoneInput', { read: ElementRef }) phoneInput: ElementRef;
  @ViewChild('otp1', { read: ElementRef }) smsInput: ElementRef;
  public textForm: boolean;

  constructor(
    private logInServer: LoginService,
    private navigateService: NavigateHlperService,
    private platform: Platform,
    public navCtrl: NavController
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      navigator['app'].exitApp();
    });

    this.logInServer.didSendSms.subscribe((e) => {
      this.textForm = e;
    });
  }
  ngOnDestroy(): void {
    this.textForm = false;
  }
  goToIntro(): void {
    this.navigateService.goToIntro();
  }
}
