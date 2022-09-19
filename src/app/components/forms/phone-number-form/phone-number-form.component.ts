import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { LoginService } from 'src/app/services/login.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
@Component({
  selector: 'app-phone-number-form',
  templateUrl: './phone-number-form.component.html',
  styleUrls: ['./phone-number-form.component.scss'],
})
export class PhoneNumberFormComponent implements OnInit {
  @ViewChild('phoneInput') phoneInputRef: ElementRef<any>;
  public phoneNumderForm: FormGroup;
  constructor(
    private logInServer: LoginService,
    private utils: UtilsService
  ) {}

  ngOnInit() {
    this.phoneNumderForm = new FormGroup({
      phone: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
    });
  }
  ionViewDidEnter(){
   this.phoneInputRef.nativeElement.setFocus();
  }
  async onPhoneNumderFormSubmit() {
    // const loader = this.utils.showLoader();
    this.logInServer.sendVerificationCode(this.phoneNumderForm.value).subscribe(
      async (res) => {
        // this.utils.dismissLoader(loader);
        this.logInServer.didSendSms.next(true);
        setTimeout(() => {
          
        }, 150);
      },
      async (res) => {
        // this.utils.dismissLoader(loader);
        this.logInServer.didSendSms.next(false);
        this.onHttpErorr(res, '');
      }
    );
   
  }
  async onHttpErorr(e, header) {
    this.utils.showalert(e, header);
  }
}
