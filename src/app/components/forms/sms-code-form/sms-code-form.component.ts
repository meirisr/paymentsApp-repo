import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserLoginService } from 'src/app/services/api/user-login.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { Storage } from '@capacitor/storage';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
const PHONE_NUM = 'my-phone';
@Component({
  selector: 'app-sms-code-form',
  templateUrl: './sms-code-form.component.html',
  styleUrls: ['./sms-code-form.component.scss'],
})
export class SmsCodeFormComponent implements OnInit {
  public smsCodeForm: FormGroup;
  constructor(
    private router: Router,
    private apiUserServer: UserLoginService,
    private utils: UtilsService,
    private storageService: StorageService,

  ) { }

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
  async onSmsCodeFormSubmit() {
    const loader = this.utils.showLoader();
    const credentials = {
      phone:this.storageService.userPhoneNumber,
      text: Object.values(this.smsCodeForm.value).join(''),
    };
      console.log(this.storageService.userPhoneNumber);
    this.apiUserServer.getToken(credentials).subscribe(
      async () => {
        this.utils.dismissLoader(loader);
        this.router.navigateByUrl('/menu', { replaceUrl: true });
      },
      async (res) => {
        this.onHttpErorr(res, '', loader);
      }
    );
  }
  otpController(event, next, prev) {
    if(this.smsCodeForm.valid){
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
  async onHttpErorr(e, header, loader) {
    this.utils.dismissLoader(loader);
    this.utils.showalert(e, header);
  }
  async resendSms() {
    const loader = this.utils.showLoader();
    this.apiUserServer.getSms({phone: this.storageService.userPhoneNumber}).subscribe(
      async (res) => {
        this.utils.dismissLoader(loader);
        setTimeout(() => {
        }, 150);
      },
      async (res) => {
        console.log(res);
        this.apiUserServer.didSendSms.next(false);
        this.onHttpErorr(res, '', loader);
      }
    );
  }
  back() {
    this.apiUserServer.didSendSms.next(false);
  }

}
