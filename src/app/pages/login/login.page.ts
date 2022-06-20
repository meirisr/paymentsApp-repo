import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/app/services/api/user-login.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

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
    private utils: UtilsService
  ) {}
  get phone() {
    return this.credentials.get('phone');
  }
  get text() {
    return this.credentials.get('phone');
  }
  ngOnInit() {
    setTimeout(() => {
      this.phoneInput.nativeElement.setFocus();
    }, 150);
    this.textForm = false;
    this.credentials = new FormGroup({
      phone: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
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
    const loader = this.utils.showLoader();
    this.apiUserServer.getSms(this.credentials.value).subscribe(
      async (res) => {
        this.utils.dismissLoader(loader);
        this.textForm = true;
        setTimeout(() => {
          this.smsInput.nativeElement.setFocus();
        }, 150);
      },
      async (res) => {
        this.onHttpErorr(res, '', loader);
      }
    );
  }

  async getToken() {
    const loader = this.utils.showLoader();
    const credentials = {
      phone: this.credentials.value,
      text: Object.values(this.textCredentials.value).join(''),
    };
    this.apiUserServer.getToken(credentials).subscribe(
      async () => {
        this.utils.dismissLoader(loader);
        this.router.navigateByUrl('/menu', { replaceUrl: true });
        console.log(this.apiUserServer.isAuthenticated);
      },
      async (res) => {
        this.onHttpErorr(res, '', loader);
      }
    );
  }
  otpController(event, next, prev) {
    console.log(event.path[1].id);
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
  back() {
    this.textForm = false;
  }
}
