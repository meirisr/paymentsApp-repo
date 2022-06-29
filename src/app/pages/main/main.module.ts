import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { GlobalModule } from './share/share.module';
import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './main-routing.module';

import { MainPage } from './main.page';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalModule } from 'src/app/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainPageRoutingModule,
    TranslateModule,
    GlobalModule
  ],
  declarations: [MainPage]
})
export class MainPageModule {}
