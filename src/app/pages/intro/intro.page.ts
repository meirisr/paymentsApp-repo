import { Component, OnInit, ViewChild ,AfterViewInit} from '@angular/core';
import { IonSlides } from '@ionic/angular';
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
import { LowerCasePipe } from '@angular/common';

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
    {"name":"hhhh"},
    {"name":"ff"},
    {"name":"hhyyyh"},
    {"name":"ffgg"},
    {"name":"hhyfhhbfhh"},
  ]
  tempitems=[...this.items];
  // slide1Body ='ברוכים הבאים';

  constructor(
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit() {}
  ngAfterViewInit(): void {
    this.hideSplashScreen();
  }
  async hideSplashScreen(){
    await SplashScreen.hide();
   }
  next() {
    // this.translate.use('he');
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
  
}
