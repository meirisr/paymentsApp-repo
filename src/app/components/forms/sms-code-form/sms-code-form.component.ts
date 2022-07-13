import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { ModalController, NavController } from '@ionic/angular';
import { PopupModalComponent } from '../../popup-modal/popup-modal.component';
import { AuthenticationService } from 'src/app/services/authentication.service';

const HOTEL_ID = 'my-hotel';

@Component({
  selector: 'app-sms-code-form',
  templateUrl: './sms-code-form.component.html',
  styleUrls: ['./sms-code-form.component.scss'],
})
export class SmsCodeFormComponent implements OnInit {
  @ViewChild('otp1') codeInputRef: ElementRef<any>;
  public smsCodeForm: FormGroup;
  constructor(
    private router: Router,
    private logInServer: LoginService,
    private utils: UtilsService,
    private storageService: StorageService,
    private modalController: ModalController,
    private authenticationService: AuthenticationService,
    private nav: NavController
  ) {}

  ngOnInit() {
    this.smsCodeForm = new FormGroup({
      text1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(1),
      ]),
      text2: new FormControl(null, [
        Validators.required,
        Validators.maxLength(1),
      ]),
      text3: new FormControl(null, [
        Validators.required,
        Validators.maxLength(1),
      ]),
      text4: new FormControl(null, [
        Validators.required,
        Validators.maxLength(1),
      ]),
      text5: new FormControl(null, [
        Validators.required,
        Validators.maxLength(1),
      ]),
      text6: new FormControl(null, [
        Validators.required,
        Validators.maxLength(1),
      ]),
    });
  }
  ionViewDidEnter() {
    this.codeInputRef.nativeElement.setFocus();
  }
  async onSmsCodeFormSubmit() {
    let loader=this.utils.showLoader();
    const credentials = {
      phone: this.storageService.userPhoneNumber,
      text: Object.values(this.smsCodeForm.value).join(''),
    };
    this.logInServer.getToken(credentials).subscribe(
      async (data) => {
        this.utils.dismissLoader(loader);
       await this.authenticationService.loadToken().then(()=>{
        setTimeout(() => {
          this.nav.navigateForward('/intro');
        },200);
       });
          
   
      },
      async (res) => {
        this.utils.dismissLoader(loader);
        this.onHttpErorr(res, '');
      }
    );
  }
  otpController(event, next, prev) {
    if (this.smsCodeForm.valid) {
      this.onSmsCodeFormSubmit();
    }
    if (event.target.value.length < 1 && prev) {
      prev.setFocus();
    } else if (next && event.target.value.length > 0) {
      next.setFocus();
    } else {
      return 0;
    }
  }
  async onHttpErorr(e, header) {
   
    this.utils.showalert(e, header);
  }
  async resendSms() {
    this.smsCodeForm.reset();
    const loader = this.utils.showLoader();
    this.logInServer
      .sendVerificationCode({ phone: this.storageService.userPhoneNumber })
      .subscribe(
        async () => {
          this.utils.dismissLoader(loader);
          setTimeout(() => {}, 150);
        },
        async (res) => {
          this.utils.dismissLoader(loader);
          this.logInServer.didSendSms.next(false);
          this.onHttpErorr(res, '');
        }
      );
  }
  back() {
    this.logInServer.didSendSms.next(false);
  }
  
}
