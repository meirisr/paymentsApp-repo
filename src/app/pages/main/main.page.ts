import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils/utils.service';
const HOTEL_ID = 'my-hotel';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage  {
  headerText:string;
  // transportationOptions = [
  //   {
  //     title: 'אוטובוס',
  //     color: '#ffca22',
  //     id: 1,
  //     callback:()=>this.onClick(1)
  //   },
  //   {
  //     title: 'רכבת קלה',
  //     color: '#29c467',
  //     id: 2,
  //     callback:()=>this.onClick(2)
  //   },
  //   {
  //     title: 'רכבת ישראל',
  //     color: '#cf3c4f',
  //     id: 3,
  //     callback:()=>this.onClick(3)
  //   },
  //   {
  //     title: 'רכבלית',
  //     color: '#50c8ff',
  //     id: 4,
  //     callback:()=>this.onClick(4)
  //   },
  //   {
  //     title: 'מטרונית',
  //     color: '#fd7e14',
  //     id: 5,
  //     callback:()=>this.onClick(5)
  //   },
  //   {
  //     title: 'הסעות בתי מלון',
  //     color: '#d63384',
  //     id: 6,
  //     callback:()=> {
  //       this.router.navigate(['/scan']);
  //     }
  //   },
  // ];

  constructor( private router: Router,private utils:UtilsService,   private platform: Platform,) {
    this.platform.backButton.subscribeWithPriority(10, () => {
     App.exitApp();
       
    });
  }

  ionViewWillEnter() {
    this.getHotel()
  }
  onClick(){
    this.router.navigate(['/scan']);
  }
 async getHotel(){
  const hotel= (await this.utils.getStorege(HOTEL_ID)).value
  console.log(hotel)
  this.headerText= hotel=='null' ?'': hotel;
  }
}
