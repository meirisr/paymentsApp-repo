import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapComponent } from '../components/map/map.component';
import { CreditCardComponent } from '../components/credit-card/credit-card.component';
import { LoginStepsNavbarComponent } from '../components/login-steps-navbar/login-steps-navbar.component';
import { TranslateModule } from '@ngx-translate/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { MainBtnComponent } from '../components/main-btn/main-btn.component';
import { PhoneNumberFormComponent } from '../components/forms/phone-number-form/phone-number-form.component';
import { SmsCodeFormComponent } from '../components/forms/sms-code-form/sms-code-form.component';




const content = [
  MapComponent,
  CreditCardComponent,
  LoginStepsNavbarComponent,
  MainBtnComponent,
  PhoneNumberFormComponent,
  SmsCodeFormComponent
];

@NgModule({
  declarations: content,
  exports: [content],
  imports: [CommonModule, IonicModule, FormsModule,ReactiveFormsModule,TranslateModule,GoogleMapsModule]
})
export class GlobalModule {}
