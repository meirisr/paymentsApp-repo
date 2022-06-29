import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TravelRouteTrackingPageRoutingModule } from './travel-route-tracking-routing.module';

import { TravelRouteTrackingPage } from './travel-route-tracking.page';
import { GlobalModule } from 'src/app/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TravelRouteTrackingPageRoutingModule,
    GlobalModule
  ],
  declarations: [TravelRouteTrackingPage]
})
export class TravelRouteTrackingPageModule {}
