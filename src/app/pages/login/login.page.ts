import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

import {LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements  OnDestroy{
  @ViewChild('phoneInput', { read: ElementRef }) phoneInput: ElementRef;
  @ViewChild('otp1', { read: ElementRef }) smsInput: ElementRef;
  public textForm: boolean;

  constructor(private logInServer: LoginService, private router: Router,private nav: NavController) {
    this.logInServer.didSendSms.subscribe((e) => {
      this.textForm = e;
    });
  }
  ngOnDestroy() {
    this.textForm =false;
  }
  goToIntro(){
    this.nav.navigateBack('/intro',{ replaceUrl: true ,animationDirection: 'back', animated: true });
    // this.router.navigate(['/intro']);
  }
}
