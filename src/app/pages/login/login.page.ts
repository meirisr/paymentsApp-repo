import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/app/services/api/user-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  textForm: boolean;
  credentials: FormGroup;
  textCredentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private apiUserServer: UserLoginService
  ) {}
  get phone() {
    return this.credentials.get('phone');
  }
  get text() {
    return this.credentials.get('phone');
  }
  ngOnInit() {
    this.textForm= false;
    this.credentials = new FormGroup({
      phone: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
      // password: new FormControl(null),
    });
    this.textCredentials = new FormGroup({
      text: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
      // password: new FormControl(null),
    });
  }

  async getSms() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.apiUserServer.getSms(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss();
        this.textForm=true;
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
    const credentials={
     phone: this.credentials.value,
     text:  this.textCredentials.value
    };
    this.apiUserServer.getToken(credentials).subscribe(
      async (res) => {
        await loading.dismiss();
        this.router.navigateByUrl('/menu',{ replaceUrl: true });
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
  // Easy access for form fields
  // eslint-disable-next-line @typescript-eslint/member-ordering
  // get email() {
  //   return this.credentials.get('email');
  // }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  // get password() {
  //   return this.credentials.get('password');
  // }
}
