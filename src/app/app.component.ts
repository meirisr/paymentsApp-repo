import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, IonRouterOutlet } from '@ionic/angular';
import { UtilsService } from './services/utils/utils.service';
import { Network } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';
import { AuthenticationService } from './services/authentication.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { AlertService } from './services/utils/alert.service';

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
    private alertService: AlertService,
    private authenticationService: AuthenticationService
  ) {
    if (Capacitor.isNativePlatform())
      window.screen.orientation.lock('portrait');

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
    this.utils.getUserLanguage().then(() => {
      this.utils.loadGoogleMap();
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
    if (!status.connected) {
      this.alertService.connectionAlert();
    }
  };
}
