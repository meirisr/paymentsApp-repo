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

    private platform: Platform,
    private openNativeSettings: OpenNativeSettings
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['/menu']);
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    console.log(this.result);
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

  ngOnDestroy() {
    document.querySelector('body').classList.remove('scanBg');
    if (Capacitor.isNativePlatform()) {
      BarcodeScanner.stopScan();
    }
    this.scanNotAllowed = false;
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
        // this.scanActive = true;
        setTimeout(() => {
          this.router.navigate(['/payment']);
        }, 10);
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
    console.log(locationStatus);
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
    }
  else {
      // this.permissionAlert();
      this.location.back();
      return false;
      //  this.permissionAlert();
      // const c = confirm(
      //   'If you want to grant permission for using your locaiton, enable it in the app settings.'
      // );
      // if (c) {
      //   BarcodeScanner.openAppSettings();
      // } else {
      //   navigator['app'].exitApp();
      // }
    }
    // return true;
    // .then(
    //     async () => {
    //       const coordinates = await Geolocation.getCurrentPosition();

    //       const latLng = new google.maps.LatLng(
    //         coordinates.coords.latitude,
    //         coordinates.coords.longitude
    //       );
    //     },
    //     async () => {
    //       console.log('jjjj');
    //     }
    //   );
  }

  stopScanner() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }
  async permissionAlert() {
    const alert = await this.alertController.create({
      header: 'Confirm permission',
      message: `<img src="../../../assets/images/Group 2660.png">`,
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
  checkisFlashAvailable() {
    // this.flashlight.available().then((data) => {
    //   this.isFlashAvailable = data;
    // });
  }
  async switchOnFlash() {
    // this.flashlight.switchOn().then(() => {
    //   this.isFlashOn=true;
    // });
    // this.isFlashOn = await this.flashlight.switchOn();
  }
  async switchOffFlash() {
    // this.isFlashOn = await this.flashlight.switchOff();
  }
  isSwitchedOn() {
    //  let is this.flashlight.isSwitchedOn()
    //     this.isFlashOn = data.value;
  }
  toggleFlash() {
    // this.flashlight.toggle();
  }
  goTomenu() {
    this.router.navigate(['/menu']);
  }
}
