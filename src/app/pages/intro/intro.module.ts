import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntroPageRoutingModule } from './intro-routing.module';

import { IntroPage } from './intro.page';
import { GlobalModule } from 'src/app/share/share.module';
import { SwiperModule } from 'swiper/angular';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, IntroPageRoutingModule,GlobalModule,SwiperModule,TranslateModule],
  declarations: [IntroPage,],
})
export class IntroPageModule {}
