import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/app/services/api/user-login.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { filter, map ,take} from 'rxjs/operators';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('phoneInput', { read: ElementRef }) phoneInput: ElementRef;
  @ViewChild('otp1', { read: ElementRef }) smsInput: ElementRef;
  public textForm: boolean;


  constructor(
    private apiUserServer: UserLoginService,
  ) {
    this.apiUserServer.didSendSms.subscribe((e)=>{
      this.textForm=e;
    });
  }
  ngOnInit() {}

}
