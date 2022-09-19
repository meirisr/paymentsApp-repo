import { Component, OnInit } from '@angular/core';
import {LottieComponent} from '../lottie/lottie.component'

@Component({
  selector: 'app-popup-modal',
  templateUrl: './popup-modal.component.html',
  styleUrls: ['./popup-modal.component.scss'],
})
export class PopupModalComponent implements OnInit {
   header:string;
   text:string;
   type:string;
  constructor() { }

  ngOnInit() {
    console.log(this.type)
  }

}
