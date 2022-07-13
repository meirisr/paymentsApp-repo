import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, IonRouterOutlet, AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { UtilsService } from './services/utils/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@capacitor/network';
import { App } from '@capacitor/app';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { Navigation } from 'swiper';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet;
  apiLoaded = false;
  constructor(
    private platform: Platform,
    private location: Location,
    private httpClient: HttpClient,
    private utils: UtilsService,
    private translate: TranslateService,
    private alertController: AlertController,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    translate.setDefaultLang('en');
    translate.use('he');
    App.getState().then((status) => console.log('status:', status));
    this.platform.backButton.subscribeWithPriority(0, () => {
    console.log(this.router.url)
      if (!this.routerOutlet.canGoBack()||this.router.url=='/menu') {
        router.navigate['app'].exitApp() 
      } 
    });
    const key = environment.googleMapsKey;
    this.httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${key}&language=en`,
        'callback'
      )
      .pipe(
        map(() => true),
        catchError(() => of(false))
      )
      .subscribe((result) => {
        this.apiLoaded = result;
      });
    Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed', status);
      if (!status.connected) {
        this.showalert();
      }
    });
    this.logCurrentNetworkStatus();
  }

  ngOnInit() {
    this.utils.getUserTheme();
    this.utils.getUserLanguage();
    this.authenticationService.loadToken();
  }
  logCurrentNetworkStatus = async () => {
    const status = await Network.getStatus();
    console.log('Network status:', status);
    if (!status.connected) {
      this.showalert();
    }
  };
  async showalert() {
    const alert = await this.alertController.create({
      header: 'Loading Error',
      message: 'No Internet Connection. Please try again later',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            App.exitApp();
          },
        },
      ],
    });
    await alert.present();
  }
}
