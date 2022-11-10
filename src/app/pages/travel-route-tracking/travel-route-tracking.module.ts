import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TravelRouteTrackingPageRoutingModule } from './travel-route-tracking-routing.module';

import { TravelRouteTrackingPage } from './travel-route-tracking.page';
import { GlobalModule } from 'src/app/share/share.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TravelRouteTrackingPageRoutingModule,
    TranslateModule,
    GlobalModule
  ],
  declarations: [TravelRouteTrackingPage]
})
export class TravelRouteTrackingPageModule {}
