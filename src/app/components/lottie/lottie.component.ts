import { Component, Input, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-lottie',
  templateUrl: './lottie.component.html',
  styleUrls: ['./lottie.component.scss'],
})
export class LottieComponent implements OnInit {
  @Input() type :string;
  height:string;

  constructor() {
    
   }
  options: AnimationOptions = {
    path: '',
  }

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }
  ngOnInit() {
    this.generateOptios(this.type);
  }
  generateOptios(type:string){
    console.log(type)
 switch (type) {
  case 'chack':
    this.options = {
      ...this.options, // In case you have other properties that you want to copy
      path: '../../../assets/lottie/chack.json',
      
    };
    this.height="200px";
    break;
 
  default:
    this.options = {
      ...this.options, // In case you have other properties that you want to copy
      path: '../../../assets/lottie/error.json',
    };
    this.height="150px";
    break;
 }
  }

}
