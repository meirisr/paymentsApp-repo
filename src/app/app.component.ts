import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, IonRouterOutlet } from '@ionic/angular';
import { UtilsService } from './services/utils/utils.service';
// import { TranslateService } from '@ngx-translate/core';
import { Network } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';
import { AuthenticationService } from './services/authentication.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { AlertService } from './services/utils/alert.service';
import { UserInfoService } from './services/user-info.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet;
  constructor(
    private platform: Platform,
    private utils: UtilsService,
    private userInfoServer: UserInfoService,
    // private translate: TranslateService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService
  ) {
    if (Capacitor.isNativePlatform())
      window.screen.orientation.lock('portrait');

    // translate.setDefaultLang('en');
    // translate.use('he');
    // App.getState().then((status) => console.log('status:', status));
    this.hideSplashScreen();
    Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed', status);
      if (!status.connected) {
        this.alertService.connectionAlert();
      }
    });
    this.logCurrentNetworkStatus();
  }

  ngOnInit() {
    this.utils.getUserLanguage().then(()=> {
      this.utils.loadGoogleMap()
    });
    this.utils.loadRoute();
    // this.userInfoServer.getUnpaidTrips();
    // this.userInfoServer.getUserDetails();
    // this.userInfoServer.getCreditCardInfo();
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
    // console.log('Network status:', status);
    if (!status.connected) {
      this.alertService.connectionAlert();
    }
  };
}
