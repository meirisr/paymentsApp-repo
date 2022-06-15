import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MapComponent } from '../components/map/map.component';


const content = [
  MapComponent
];

@NgModule({
  declarations: content,
  exports: content,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class GlobalModule {}
