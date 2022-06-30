import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserDetailsPageRoutingModule } from './user-details-routing.module';
import { UserDetailsPage } from './user-details.page';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalModule } from 'src/app/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UserDetailsPageRoutingModule,
    TranslateModule,
    GlobalModule
  ],
  declarations: [UserDetailsPage]
})
export class UserDetailsPageModule {}
