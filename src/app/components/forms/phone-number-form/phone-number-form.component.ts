import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/app/services/api/user-login.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
@Component({
  selector: 'app-phone-number-form',
  templateUrl: './phone-number-form.component.html',
  styleUrls: ['./phone-number-form.component.scss'],
})
export class PhoneNumberFormComponent implements OnInit {
  public phoneNumderForm: FormGroup;
  constructor(
    private apiUserServer: UserLoginService,
    private utils: UtilsService
  ) {}

  ngOnInit() {
    this.phoneNumderForm = new FormGroup({
      phone: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }
  async onPhoneNumderFormSubmit() {
    const loader = this.utils.showLoader();
    this.apiUserServer.getSms(this.phoneNumderForm.value).subscribe(
      async (res) => {
        this.utils.dismissLoader(loader);
        this.apiUserServer.didSendSms.next(true);
        setTimeout(() => {
          // this.smsInput.nativeElement.setFocus();
        }, 150);
      },
      async (res) => {
        console.log(res);
        this.apiUserServer.didSendSms.next(false);
        this.onHttpErorr(res, '', loader);
      }
    );
    console.log(this.apiUserServer.didSendSms);
  }
  async onHttpErorr(e, header, loader) {
    this.utils.dismissLoader(loader);
    this.utils.showalert(e, header);
  }
}
