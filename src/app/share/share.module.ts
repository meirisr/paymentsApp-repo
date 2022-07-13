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
import { BackBtnComponent } from '../components/back-btn/back-btn.component';
import { HeaderWaveComponent } from '../components/header-wave/header-wave.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';


export function playerFactory() {
  return player;
}


const content = [
  MapComponent,
  CreditCardComponent,
  LoginStepsNavbarComponent,
  MainBtnComponent,
  PhoneNumberFormComponent,
  SmsCodeFormComponent,
  BackBtnComponent,
  HeaderWaveComponent
];

@NgModule({
  declarations: content,
  exports: [content],
  imports: [CommonModule, IonicModule, FormsModule,ReactiveFormsModule,TranslateModule,GoogleMapsModule,LottieModule.forRoot({ player: playerFactory })]
})
export class GlobalModule {}
