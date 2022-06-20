import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MapComponent } from '../components/map/map.component';
import { InputCodeComponent } from '../components/input-code/input-code.component';




const content = [
  MapComponent,
  InputCodeComponent,
];

@NgModule({
  declarations: content,
  exports: content,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class GlobalModule {}
