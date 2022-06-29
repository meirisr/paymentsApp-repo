import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CreditCardDetailsPageRoutingModule } from './credit-card-details-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { CreditCardDetailsPage } from './credit-card-details.page';
import { GlobalModule } from 'src/app/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreditCardDetailsPageRoutingModule,
    TranslateModule,
    GlobalModule
  ],
  declarations: [CreditCardDetailsPage]
})
export class CreditCardDetailsPageModule {}
