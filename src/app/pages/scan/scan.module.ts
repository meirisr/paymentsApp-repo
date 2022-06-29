import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ScanPageRoutingModule } from './scan-routing.module';
import { ScanPage } from './scan.page';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ScanPageRoutingModule],
  declarations: [ScanPage],
  providers: [OpenNativeSettings],
})
export class ScanPageModule {}
