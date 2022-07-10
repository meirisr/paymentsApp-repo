import { Component, OnInit, ViewChild ,AfterViewInit} from '@angular/core';
import { IonSlides, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import SwiperCore, {
  Autoplay,
  Keyboard,
  Pagination,
  Scrollbar,
  Zoom,
} from 'swiper';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { App } from '@capacitor/app';

const HOTEL_ID = 'my-hotel';
SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom]);

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit,AfterViewInit {
  @ViewChild(IonSlides) slides: IonSlides;
  prefersDark;
  translaetPath;
  searchTerm
  
  items=[
    {name:"מלון דן תל אביב",
    id:"מלון דן תל אביב"},
    {name:"מלון כרמים",id:"מלון כרמים"},
    {name:"מלון בראשית",id:"מלון בראשית"},
    {name:"מלון פלאזה ים המלח",id:"מלון פלאזה ים המלח"},
  
  ]
  tempitems=[...this.items];
  // slide1Body ='ברוכים הבאים';

  constructor(
    private router: Router,
    private translate: TranslateService,
    private platform: Platform,
    private utils: UtilsService
  ) { 
    this.platform.backButton.subscribeWithPriority(10, () => {
       App.exitApp()
    });
  }

  ngOnInit() {}
  ngAfterViewInit(): void {
    // this.hideSplashScreen();
  }
  async hideSplashScreen(){
    // await SplashScreen.hide();
   }
  next() {
    this.utils.setStorege(HOTEL_ID, 'null');
    this.router.navigate(['/login']);
  }
  toggleDarkTheme(matchesMode) {
    this.prefersDark = matchesMode;
  }
  handleInput(event:Event) {
      const query = (event.target as HTMLInputElement).value.toLowerCase();
     
        this.tempitems=[...this.items.filter(item=>{
         return item.name.toLowerCase().indexOf(query) > -1;
      })]
    
  }
  onClickHotel(id){
    this.utils.setStorege(HOTEL_ID, id);
    this.router.navigate(['/login']);
  }
  
}
