import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MenuPageRoutingModule } from './menu-routing.module';
import { MenuPage } from './menu.page';
import { GlobalModule } from 'src/app/share/share.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MenuPageRoutingModule,GlobalModule,GoogleMapsModule,TranslateModule],
  declarations: [MenuPage],
})
export class MenuPageModule {}
