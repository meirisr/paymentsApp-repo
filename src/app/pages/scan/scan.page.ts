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

const HOTEL_ID = 'my-hotel';
let loader;
@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {
  isFlashAvailable = false;
  isFlashOn = false;
  scanActive = false;
  scanNotAllowed = false;
  result = null;
  element;
  userLocation={
    latitude:0,
    longitude:0
  }
  constructor(
    private alertController: AlertController,
    private utils: UtilsService,
    private location: Location,
    private openNativeSettings: OpenNativeSettings,
    private storageService: StorageService,
    private nav: NavController,
    private travelProcessService: TravelProcessService,
    private platform: Platform,
  ) {
    // this.platform.backButton.subscribeWithPriority(10, () => {
    //   this.nav.navigateBack('/menu',{ replaceUrl: true  });
    // });
  }

  ngOnInit() {
   loader =this.utils.showLoader();
    console.log("onInit")
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
        this.nav.navigateBack('/menu',{ replaceUrl: true });
      }, 3000);
    }
  }

  ionViewWillLeave() {
    this.utils.dismissLoader(loader);
    document.querySelector('body').classList.remove('scanBg');
    if (Capacitor.isNativePlatform()) {
      BarcodeScanner.stopScan();
    }
    this.scanNotAllowed = false;
  }
  ngOnDestroy() {
    document.querySelector('body').classList.remove('scanBg');
    
  }
  async startScanner() {
    const allowed = await this.checkPermission();
    if (allowed) {
   
      document.querySelector('body').classList.add('scanBg');
      this.utils.dismissLoader(loader);
      this.scanActive = true;
      this.result = null;
      BarcodeScanner.hideBackground();
      const result = await BarcodeScanner.startScan({
        targetedFormats: [SupportedFormat.QR_CODE],
      });
      if (result.hasContent) {
        this.result = result.content;
        this.scanActive = false;
        this.travelProcessService.getTravel(this.userLocation,	44985002).subscribe(async(data)=>{
          console.log(data)
          // if (data.data.statusCode) return;
          let hotelId = !!(await this.storageService.getStorege(HOTEL_ID))
          if (hotelId) {
            this.nav.navigateForward('/payment', { animationDirection: 'forward', animated: true })
           
  
          } else {
            this.nav.navigateForward('/travel-route-tracking', { animationDirection: 'forward', animated: true })
           await this.utils.presentModal('נסיעה טובה','');
         
          }
        },
        async(err)=>{
          console.log(err)
          setTimeout(() => {
            this.nav.navigateBack('/menu',{ replaceUrl: true });
          }, 3000);
        })
        
      }
      
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
        this.userLocation.latitude=coordinates.coords.latitude;
        this.userLocation.longitude=coordinates.coords.longitude
        
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
    this.nav.navigateBack('/menu',{ replaceUrl: true ,animationDirection: 'back', animated: true });
  }
}
