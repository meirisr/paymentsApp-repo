import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {NavController, Platform } from '@ionic/angular';
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
    private platform: Platform,
    public navCtrl: NavController
  ) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      App.exitApp();
  });
  

    this.logInServer.didSendSms.subscribe((e) => {
      this.textForm = e;
    });
  }
  ngOnDestroy():void {
    this.textForm = false;
  }
  goToIntro():void {
    this.navCtrl.navigateRoot(['intro'],{replaceUrl:true})
    // this.router.navigate(['/intro']);
  }
}
