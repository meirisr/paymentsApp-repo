import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
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
  public credentials: FormGroup;
  public textCredentials: FormGroup;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private apiUserServer: UserLoginService,
  ) {}
  get phone() {
    return this.credentials.get('phone');
  }
  get text() {
    return this.credentials.get('phone');
  }
  ngOnInit() {
    setTimeout(()=>{
      this.phoneInput.nativeElement.setFocus();
    },150);
    this.textForm = false;
    this.credentials = new FormGroup({
      phone: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
      // password: new FormControl(null),
    });
    this.textCredentials = new FormGroup({
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
      password: new FormControl(null),
    });
  }
  async getSms() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.apiUserServer.getSms(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss();
        this.textForm = true;
        setTimeout(()=>{
          this.smsInput.nativeElement.setFocus();
        },150);
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: res.error.error.errorMessage['en-us'],
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }
  async getToken() {
    const loading = await this.loadingController.create();
    await loading.present();
    const credentials = {
      phone: this.credentials.value,
      text: Object.values(this.textCredentials.value).join(''),
    };
    this.apiUserServer.getToken(credentials).subscribe(
      async (res) => {
        await loading.dismiss();
        this.router.navigateByUrl('/menu', { replaceUrl: true });
        console.log(this.apiUserServer.isAuthenticated);
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: res.error.error.errorMessage['en-us'],
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }
  otpController(event,next,prev){
  if(event.target.value.length < 1 && prev){
    prev.setFocus();
  }
  else if(next && event.target.value.length>0){
    next.setFocus();
  }
  else {
   return 0;
  } ;
}
}
