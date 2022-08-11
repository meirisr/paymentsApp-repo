import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';
import { Router } from '@angular/router';
import {
  BarcodeScanner,
  SupportedFormat,
} from '@capacitor-community/barcode-scanner';
import { Capacitor } from '@capacitor/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { Location } from '@angular/common';
import { LoginService } from 'src/app/services/login.service';
import { StorageService } from 'src/app/services/storage.service';
import { TravelProcessService } from 'src/app/services/travel-process.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AlertService } from 'src/app/services/utils/alert.service';

const HOTEL_ID = 'my-hotel';
let loader;
@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {
  isFlashAvailable = true;
  isFlashOn = false;
  scanActive = false;
  scanNotAllowed = false;
  result = null;
  element;
  userLocation = {
    latitude: 0,
    longitude: 0,
  };
  constructor(
    private alertController: AlertController,
    private utils: UtilsService,
    private location: Location,
    private openNativeSettings: OpenNativeSettings,
    private storageService: StorageService,
    private router: Router,
    private travelProcessService: TravelProcessService,
    private platform: Platform,
    private alertService: AlertService,
    public navCtrl: NavController
  ) {}

  ngOnInit() {
    loader = this.utils.showLoader();
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
        this.navCtrl.navigateRoot(['menu'],{replaceUrl:true})
        // this.router.navigate(['/menu']);
      }, 3000);
    }
  }

  ionViewWillLeave() {
    this.utils.dismissLoader(loader);

    if (Capacitor.isNativePlatform()) {
      BarcodeScanner.stopScan();
    }
    this.scanNotAllowed = false;
  }
  ngOnDestroy() {}
  async startScanner() {
    const allowed = await this.checkPermission();
    if (allowed) {
      this.utils.dismissLoader(loader);
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
        this.travelProcessService
          .getTravelDetails(this.userLocation, 7552469)
          .subscribe(
            async (data) => {
              console.log(data);
              // if (data.data.statusCode) return;
              let hotelId = !!(await this.storageService.getStorege(HOTEL_ID));
              if (hotelId) {
                // this.router.navigate(['/payment']);
                this.navCtrl.navigateRoot(['payment'],{replaceUrl:true})
              
              } else {
                this.navCtrl.navigateRoot(['travel-route-tracking'],{replaceUrl:true})
                // this.router.navigate(['/travel-route-tracking']);
                await this.utils.presentModal('נסיעה טובה', '');
              }
            },
            async (err) => {
              console.log(err);
              setTimeout(() => {
                this.navCtrl.navigateRoot(['menu'],{replaceUrl:true})
                // this.router.navigate(['/menu']);
              }, 3000);
            }
          );
      }
    }
  }
  async checkPermission() {
    const status = await BarcodeScanner.checkPermission({ force: true });
    if (status.granted) {
      return true;
    } else if (status.denied) {
      this.permissionAlert('cameraDeteails');
    }
  }
  async checkLocationPermission() {
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

  stopScanner() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }
  toggleFlash() {
    BarcodeScanner.toggleTorch();
    this.isFlashOn = !this.isFlashOn;
  }

  permissionAlert(type: string) {
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

  goTomenu() {
    this.navCtrl.navigateRoot(['menu'],{replaceUrl:true})
    // this.router.navigate(['/menu']);
  }
}
