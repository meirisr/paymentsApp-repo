import { Component, OnInit, ViewChild ,AfterViewInit} from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { INTRO_KEY } from 'src/app/guards/intro.guard';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { SplashScreen } from '@capacitor/splash-screen';
import SwiperCore, {
  Autoplay,
  Keyboard,
  Pagination,
  Scrollbar,
  Zoom,
} from 'swiper';
import { TranslateService } from '@ngx-translate/core';

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
    this.translate.use('he');
    // this.slides.slideNext();
    this.router.navigate(['/login']);
  }
  async start() {
    await Storage.set({ key: INTRO_KEY, value: 'true' });
    this.router.navigate(['/scan']);
    // this.router.navigateByUrl('/login', { replaceUrl:true });
  }
  toggleDarkTheme(matchesMode) {
    this.prefersDark = matchesMode;
  }
  // registration() {
  //   this.router.navigate(['/login']);
  // }
}
