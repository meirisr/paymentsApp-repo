import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { LoginService } from 'src/app/services/login.service';

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
    private router: Router,
    private nav: NavController,
    private platform: Platform
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      App.exitApp();
    });

    this.logInServer.didSendSms.subscribe((e) => {
      this.textForm = e;
    });
  }
  ngOnDestroy() {
    this.textForm = false;
  }
  goToIntro() {
    this.router.navigate(['/intro']);
  }
}
