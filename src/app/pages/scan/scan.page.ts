import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';
import { Router } from '@angular/router';
import {
  BarcodeScanner,
  SupportedFormat,
} from '@capacitor-community/barcode-scanner';
import { Capacitor } from '@capacitor/core';
import { AlertController, Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { Location } from '@angular/common';
import { UserLoginService } from 'src/app/services/api/user-login.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit, AfterViewInit, OnDestroy {
  isFlashAvailable = false;
  isFlashOn = false;
  scanActive = false;
  scanNotAllowed = false;
  result = null;
  element;
  constructor(
    private alertController: AlertController,
    private router: Router,
    private location: Location,
    private apiUserServer: UserLoginService,
    private platform: Platform,
    private openNativeSettings: OpenNativeSettings,
    private utils:UtilsService
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['/menu']);
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
  
    // if (Capacitor.isNativePlatform()) {
    //   this.checkLocationPermission().then((e) => {
    //     if (e) {
    //       BarcodeScanner.prepare();
    //       this.startScanner();
    //     }
    //   });
    //   this.scanNotAllowed = false;
    // } else {
    //   this.scanNotAllowed = true;
    //   setTimeout(() => {
    //     this.router.navigate(['/menu']);
    //   }, 3000);
    // }
  }
  ionViewDidEnter(){
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
        this.router.navigate(['/menu']);
      }, 3000);
    }
  }
  ionViewWillLeave(){
    document.querySelector('body').classList.remove('scanBg');
    if (Capacitor.isNativePlatform()) {
      BarcodeScanner.stopScan();
    }
    this.scanNotAllowed = false;
  }
  ngOnDestroy() {
    // document.querySelector('body').classList.remove('scanBg');
    // if (Capacitor.isNativePlatform()) {
    //   BarcodeScanner.stopScan();
    // }
    // this.scanNotAllowed = false;
  }
  async startScanner() {
    const allowed = await this.checkPermission();
    if (allowed) {
      this.scanActive = true;
      this.result = null;
      BarcodeScanner.hideBackground();
      const result = await BarcodeScanner.startScan({
        targetedFormats: [SupportedFormat.QR_CODE],
      });
      if (result.hasContent) {
        this.result = result.content;
        // BarcodeScanner.stopScan();
        this.scanActive = false;
        this.router.navigate(['/payment']);
      //   this.apiUserServer.getTravel().subscribe(async () => {
          
      //     this.router.navigate(['/payment']);
      //   }),
      //  async (e) => {
      //   18
      //  }
        // // this.scanActive = true;
        // setTimeout(() => {
       
        // }, 10);
      }
      document.querySelector('body').classList.add('scanBg');
    }
  }
  async checkPermission() {
    const status = await BarcodeScanner.checkPermission({ force: true });
    if (status.granted) {
      return true;
    } else if (status.denied) {
      this.permissionAlert();
    }
  }
  async checkLocationPermission() {
    const locationStatus = await Geolocation.requestPermissions();
  
    if (locationStatus.location) {
      try {
        const coordinates = await Geolocation.getCurrentPosition();
        console.log(coordinates.coords.latitude, coordinates.coords.longitude);
        return true;
      } catch (error) {
        this.location.back();
        const alert = await this.alertController.create({
          header: 'מיקום כבוי',
          message: 'האפליקציה חייבת גישה למיקום ',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                // this.location.back();
              },
            },
            {
              text: 'Ok',
              handler: () => {
                this.openNativeSettings.open('location');
              },
            },
          ],
        });
        await alert.present();
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
  async permissionAlert() {
    this.location.back();
    const alert = await this.alertController.create({
      header: 'Confirm permission',
      message: `האפליקציה חייבת גישה למצלמה`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.location.back();
          },
        },
        {
          text: 'Ok',
          handler: () => {
            BarcodeScanner.openAppSettings().then((res) => {
              this.startScanner();
              console.log(res);
            });
          },
        },
      ],
    });
    await alert.present();
  }

  goTomenu() {
    this.router.navigate(['/menu']);
  }
}
