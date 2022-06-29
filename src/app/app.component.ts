import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Platform, IonRouterOutlet, AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { UtilsService } from './services/utils/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { UserLoginService } from './services/api/user-login.service';

import { Network } from '@capacitor/network';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet;
  apiLoaded = false;
  constructor(
    private platform: Platform,
    private location: Location,
    private httpClient: HttpClient,
    private utils: UtilsService,
    private translate: TranslateService,
    private apiUserServer: UserLoginService,
    private alertController: AlertController
  ) {
    translate.setDefaultLang('en');
    translate.use('he');

    this.platform.backButton.subscribeWithPriority(10, () => {
      if (!this.routerOutlet.canGoBack()) {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        navigator['app'].exitApp();
      } else {
        this.location.back();
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
  }
  ngAfterViewInit(): void {
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
