import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GoogleMapPageRoutingModule } from './google-map-routing.module';

import { GoogleMapPage } from './google-map.page';
import { HttpClientJsonpModule , HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoogleMapsModule,
    GoogleMapPageRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule
  ],
  declarations: [GoogleMapPage],
  schemas:[]
})
export class GoogleMapPageModule {}
