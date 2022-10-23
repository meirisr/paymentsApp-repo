import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryPayPageRoutingModule } from './history-pay-routing.module';

import { HistoryPayPage } from './history-pay.page';
import { GlobalModule } from 'src/app/share/share.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    GlobalModule,
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryPayPageRoutingModule
  ],
  declarations: [HistoryPayPage]
})
export class HistoryPayPageModule {}
