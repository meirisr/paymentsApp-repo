import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, IonRouterOutlet, AlertController } from '@ionic/angular';
import { UtilsService } from './services/utils/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@capacitor/network';
import { App } from '@capacitor/app';
import { AuthenticationService } from './services/authentication.service';
import { SplashScreen } from '@capacitor/splash-screen';

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
    private utils: UtilsService,
    private translate: TranslateService,
    private alertController: AlertController,
    private authenticationService: AuthenticationService
  ) {
    window.screen.orientation.lock('portrait');
    translate.setDefaultLang('en');
    translate.use('he');
    App.getState().then((status) => console.log('status:', status));
    this.hideSplashScreen();
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
    this.utils.getUserLanguage().then(()=>{
      if(!this.apiLoaded){
        this.utils.loadGoogleMap();
      }

    });
  
    this.utils.loadRoute();
    this.authenticationService.loadToken();
  }
  hideSplashScreen = () => {
    this.platform.ready().then(async () => {
      setTimeout(() => {
        SplashScreen.hide({
          fadeOutDuration: 500,
        });
      }, 0);
    });
  };
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
