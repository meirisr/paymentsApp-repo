import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PaymentPageRoutingModule } from './payment-routing.module';
import { PaymentPage } from './payment.page';
import { HttpClientJsonpModule , HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { GlobalModule } from 'src/app/share/share.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoogleMapsModule,
    PaymentPageRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    GlobalModule,
    TranslateModule
  ],
  declarations: [PaymentPage],
  schemas:[]
})
export class PaymentPageModule {}
