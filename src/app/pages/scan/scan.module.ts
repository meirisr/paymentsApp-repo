import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ScanPageRoutingModule } from './scan-routing.module';
import { ScanPage } from './scan.page';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';
import { GlobalModule } from 'src/app/share/share.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ScanPageRoutingModule, GlobalModule,TranslateModule],
  declarations: [ScanPage],
  providers: [OpenNativeSettings],
})
export class ScanPageModule {}
