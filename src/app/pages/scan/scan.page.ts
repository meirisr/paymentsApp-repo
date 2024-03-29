import { Component, OnDestroy, OnInit } from '@angular/core';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';
import {
  BarcodeScanner,
  SupportedFormat,
} from '@capacitor-community/barcode-scanner';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { Location } from '@angular/common';
import { StorageService } from 'src/app/services/storage.service';
import { TravelProcessService } from 'src/app/services/travel-process.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AlertService } from 'src/app/services/utils/alert.service';
import { Subscription } from 'rxjs';
import { NavigateHlperService } from 'src/app/services/utils/navigate-hlper.service';
import { TranslationService } from 'src/app/services/utils/translation.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit , OnDestroy{
  private subscriptions: Subscription[] = [];
  isFlashAvailable: boolean = true;
  isFlashOn: boolean = false;
  scanActive: boolean = false;
  scanNotAllowed: boolean = false;
  result = null;
  userLocation = {
    latitude: 0,
    longitude: 0,
  };
  constructor(
    private plt: Platform,
    private utils: UtilsService,
    private location: Location,
    private navigateService: NavigateHlperService,
    private openNativeSettings: OpenNativeSettings,
    private storageService: StorageService,
    private travelProcessService: TravelProcessService,
    private alertService: AlertService,
    private translationService: TranslationService
  ) {
    this.plt.backButton.subscribeWithPriority(10, () => {
      this.navigateService.goToMenu();
    });
  }

  ngOnInit() {
    // let routeInfoSubscription = this.travelProcessService.paymentTrip.subscribe(
    //   async (data) => {
    //     if (data)this.navigateService.goToTravelRouteTracking();
    //   },
    //   async (error) => {
    //     console.log(error);
    //   }
    // );
    // this.subscriptions.push(routeInfoSubscription);


    // this.utils.presentLoader();
    if (Capacitor.isNativePlatform()) {
      this.checkLocationPermission().then((e) => {
        if (e) {
          BarcodeScanner.prepare();
          this.startScanner();
        }
      });
      this.scanNotAllowed = false;
    } else {
      this.scanNotAllowed = true;
      setTimeout(() => {
        // this.utils.dismissModal();
        this.navigateService.goToMenu();
      }, 3000);
    }
  }

  ionViewWillLeave() {
    if (Capacitor.isNativePlatform()) {
      BarcodeScanner.stopScan();
    }
    this.scanNotAllowed = false;
    
    document.querySelector('body').classList.remove('scanBg');
  }

  async startScanner(): Promise<void> {
    BarcodeScanner.hideBackground();
    document.querySelector('body').classList.add('scanBg');
    let hotelId = !!this.storageService.getHotelId();
    const allowed = await this.checkPermission();

    if (allowed) {
      this.scanActive = true;

      this.result = null;
      // await this.utils.dismissLoader();

      const result = await BarcodeScanner.startScan({
        targetedFormats: [SupportedFormat.QR_CODE],
      });
      if (result.hasContent) {
        this.result = result.content;
        this.stopScanner();
        document.querySelector('body').classList.remove('scanBg');
        this.travelProcessService.tripInfo.next({
          userLocation: this.userLocation,
          busNomber: this.result,
        });
        
          let hotelId = await this.storageService.getHotelId();
          this.travelProcessService
            .newTransportationDrive({userLocation:this.userLocation,busNomber:this.result}, hotelId.value)
            .subscribe(
              (data) => {
                console.log(data)
                this.travelProcessService.paymentTrip.next(true); //true
                this.storageService.setRouteDetails(true);
              },
              (err) => {
                this.travelProcessService.paymentTrip.next(false); //none
                console.log(err);
              }
            );
            this.navigateService.goToMenu();
      
        
      }
    }
  }
  async getTrip() {
    const loader = await this.utils.presentModal('מחפש מסלול', '', 'loader');
    let hotelId = await this.storageService.getHotelId();
    const TravelDetails$ = this.travelProcessService
      .getTravelDetails(this.userLocation, 7504869)
      .subscribe(
        async (data) => {
          this.utils.dismissModal();
          this.navigateService.goToPayment();
          console.log(data);
          // if (!data) {
          //   // await this.utils.presentModal('קוד אינו תקין', 'יש לסרוק קוד אחר', '',true);
          //   // setTimeout(() => {
          //   //   this.utils.dismissModal();
          //   // }, 1000);
          //   this.startScanner();
          // } else {
          //   this.navigateService.goToPayment();
          // }
        },
        async () => {
          setTimeout(() => {
            this.utils.dismissModal();
          }, 1000);
          this.startScanner();
        }
      );
  }
  async checkPermission(): Promise<boolean> {
    const status = await BarcodeScanner.checkPermission({ force: true });
    if (status.granted) {
      return true;
    } else if (status.denied) {
      this.permissionAlert('cameraDeteails');
    }
  }
  async checkLocationPermission(): Promise<boolean> {
    const locationStatus = await Geolocation.requestPermissions();
    if (locationStatus.location) {
      try {
        const coordinates = await Geolocation.getCurrentPosition();
        this.userLocation.latitude = coordinates.coords.latitude;
        this.userLocation.longitude = coordinates.coords.longitude;
        return true;
      } catch (error) {
        this.permissionAlert('locationDeteails');
      }
    } else {
      this.location.back();
      return false;
    }
  }

  stopScanner(): void {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }
  toggleFlash(): void {
    BarcodeScanner.toggleTorch();
    this.isFlashOn = !this.isFlashOn;
  }

  permissionAlert(type: string): void {
    this.stopScanner();
    this.location.back();
    const alertDeteails = {
      cameraDeteails: {
        header: 'מצלמה כבויה',
        message: `האפליקציה חייבת גישה למצלמה`,
        okHandler: () => {
          BarcodeScanner.openAppSettings();
          this.startScanner();
        },
        cancelHandler: () => {
          this.goTomenu();
        },
      },
      locationDeteails: {
        header: 'מיקום כבוי',
        message: 'האפליקציה חייבת גישה למיקום ',
        okHandler: () => {
          this.openNativeSettings.open('location');
          this.startScanner();
        },
        cancelHandler: () => {
          this.goTomenu();
        },
      },
    };
    this.alertService.cameraPermissionAlert(alertDeteails[type]);
  }

  goTomenu(): void {
    this.navigateService.goToMenu();
  }
  ngOnDestroy() {
    if (Capacitor.isNativePlatform()) {
      BarcodeScanner.stopScan();
    }
    this.scanNotAllowed = false;
    document.querySelector('body').classList.remove('scanBg');
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
