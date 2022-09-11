import { Component, OnInit } from '@angular/core';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';
import {BarcodeScanner,SupportedFormat} from '@capacitor-community/barcode-scanner';
import { Capacitor } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { Location } from '@angular/common';
import { StorageService } from 'src/app/services/storage.service';
import { TravelProcessService } from 'src/app/services/travel-process.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AlertService } from 'src/app/services/utils/alert.service';
import { Subscription } from 'rxjs';

const HOTEL_ID = 'my-hotel';
@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {
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
    private utils: UtilsService,
    private location: Location,
    private openNativeSettings: OpenNativeSettings,
    private storageService: StorageService,
    private travelProcessService: TravelProcessService,
    private alertService: AlertService,
    public navCtrl: NavController
  ) {}

  ngOnInit() {
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
        this.navCtrl.navigateRoot(['menu'], { replaceUrl: true });
      }, 3000);
    }
  }

  ionViewWillLeave() {
    if (Capacitor.isNativePlatform()) {
      BarcodeScanner.stopScan();
    }
    this.scanNotAllowed = false;
  }

  async startScanner():Promise<void> {
    const allowed = await this.checkPermission();
    if (allowed) {
      document.querySelector('body').classList.add('scanBg')
      this.scanActive = true;
      this.result = null;
      BarcodeScanner.hideBackground();
      const result = await BarcodeScanner.startScan({
        targetedFormats: [SupportedFormat.QR_CODE],
      });
      if (result.hasContent) {
        this.result = result.content;
        console.log(result);
        this.stopScanner();
        let loader = this.utils.showLoader();
        let hotelId = !!(await this.storageService.getStorege(HOTEL_ID));
        const TravelDetails$= this.travelProcessService
          .getTravelDetails(this.userLocation, 	7726869)
          .subscribe(
            async (data) => {
              this.utils.dismissLoader(loader);
              console.log(data);
              if(!data){
                this.utils.dismissLoader(loader);
                await this.utils.presentModal('שגיעה', 'לא היה ניתן למצוא מסלול');
                  this.navCtrl.navigateRoot(['menu'], { replaceUrl: true });
              }
              else{
                this.navCtrl.navigateRoot(['travel-route-tracking'], {
                  replaceUrl: true,
                });

                await this.utils.presentModal('נסיעה טובה', '');
              }
              // if (hotelId) {
              //   this.navCtrl.navigateRoot(['payment'], { replaceUrl: true });
              // } 
              // else {
              
              // }
            },
            async (err) => {
              this.utils.dismissLoader(loader);
              console.log(err);
              await this.utils.presentModal('שגיעה', 'לא היה ניתן למצוא מסלול');
              setTimeout(() => {
                this.navCtrl.navigateRoot(['menu'], { replaceUrl: true });
              }, 1000);
            }
          );
          this.subscriptions.push(TravelDetails$)
          
      }
    }
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
    this.location.back();
    const alertDeteails = {
      cameraDeteails: {
        header: 'מצלמה כבויה',
        message: `האפליקציה חייבת גישה למצלמה`,
        okHandler: () => {
          BarcodeScanner.openAppSettings();
        },
      },
      locationDeteails: {
        header: 'מיקום כבוי',
        message: 'האפליקציה חייבת גישה למיקום ',
        okHandler: () => {
          this.openNativeSettings.open('location');
        },
      },
    };
    this.alertService.cameraPermissionAlert(alertDeteails[type]);
  }
  goTomenu(): void {
    this.navCtrl.navigateRoot(['menu'], { replaceUrl: true });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    
  }
}
