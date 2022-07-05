import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { UserLoginService } from 'src/app/services/api/user-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('phoneInput', { read: ElementRef }) phoneInput: ElementRef;
  @ViewChild('otp1', { read: ElementRef }) smsInput: ElementRef;
  public textForm: boolean;

  constructor(private apiUserServer: UserLoginService) {
    this.apiUserServer.didSendSms.subscribe((e) => {
      this.textForm = e;
    });
  }
  ngOnInit() {}
}
