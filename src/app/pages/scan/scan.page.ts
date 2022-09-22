import { Component, OnInit } from '@angular/core';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';
import {
  BarcodeScanner,
  SupportedFormat,
} from '@capacitor-community/barcode-scanner';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { Location } from '@angular/common';
import {
  StorageService,
  userStoregeObj,
} from 'src/app/services/storage.service';
import { TravelProcessService } from 'src/app/services/travel-process.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AlertService } from 'src/app/services/utils/alert.service';
import { Subscription } from 'rxjs';
import { NavigateHlperService } from 'src/app/services/utils/navigate-hlper.service';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';


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
    private plt: Platform,
    private utils: UtilsService,
    private location: Location,
    private navigateService: NavigateHlperService,
    private openNativeSettings: OpenNativeSettings,
    private storageService: StorageService,
    private travelProcessService: TravelProcessService,
    private alertService: AlertService,
    private nfc: NFC, private ndef: Ndef
  ) {
    // this.utils.presentModal(
    //   '',
    //    '',
    //    'scan'
    //  );
    this.plt.backButton.subscribeWithPriority(10, () => {
      this.navigateService.goToMenu();
    });





  }

  ngOnInit() {
    
    if (Capacitor.isNativePlatform()) {
      // this.startNFC()
      this.checkLocationPermission().then((e) => {
        if (e) {
          BarcodeScanner.prepare();
          this.startScanner();
        }
      });
      this.scanNotAllowed = false;
      // setTimeout(()=>{this.utils.dismissModal()},2000) ;
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
  }

  async startScanner(): Promise<void> {

    let hotelId = !! this.storageService.getHotelId();
    const allowed = await this.checkPermission();
    if (allowed) {
      // this.utils.dismissModal();
      document.querySelector('body').classList.add('scanBg');
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
        document.querySelector('body').classList.remove('scanBg');
        
        // if (hotelId) {
        //   this.navigateService.goToPayment();
        // } else {
          this.navigateService.goToTravelRouteTracking();
        // }
        await this.utils.presentModal('נסיעה טובה', '', 'chack');
        setTimeout(()=>{this.utils.dismissModal()},2000) ;
        this.getTrip();
      }
    }
  }
  async getTrip() {
    let hotelId = await this.storageService.getHotelId();
    const TravelDetails$ = this.travelProcessService.getTravelDetails(
      this.userLocation,
      7781769
    ).subscribe((data)=>{
      this.travelProcessService.paymentTranportation(data,hotelId.value)
      
     });
    // .subscribe(
    //   async (data) => {

    //     console.log(data);
    //     if (!data) {
    //       await this.utils.presentModal(
    //         'שגיעה',
    //         'לא היה ניתן למצוא מסלול'
    //       );
    //       this.navCtrl.navigateRoot(['/menu'], { replaceUrl: true });
    //     } else {
    //       // if (hotelId) {
    //       //   this.navCtrl.navigateRoot(['/payment'], { replaceUrl: true });
    //       // }
    //       // else {
    //       //   this.navCtrl.navigateRoot(['/travel-route-tracking'], {replaceUrl: true,});
    //       // }
    //       // await this.utils.presentModal('נסיעה טובה', '');

    //     }

    //   },
    //   async (err) => {
    //     // this.utils.dismissLoader(loader);
    //     console.log(err);
    //     await this.utils.presentModal('שגיעה', 'לא היה ניתן למצוא מסלול');
    //     setTimeout(() => {
    //       this.navCtrl.navigateRoot(['/menu'], { replaceUrl: true });
    //     }, 1000);
    //   }
    //   );
    // this.subscriptions.push(TravelDetails$);
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
        cancelHandler: () => {
          this.goTomenu();
        },
      },
      locationDeteails: {
        header: 'מיקום כבוי',
        message: 'האפליקציה חייבת גישה למיקום ',
        okHandler: () => {
          this.openNativeSettings.open('location');
        },
        cancelHandler: () => {
          this.goTomenu();
        },
      },
    };
    this.alertService.cameraPermissionAlert(alertDeteails[type]);
  }

  async startNFC(){
 
    // Read NFC Tag - Android
// Once the reader mode is enabled, any tags that are scanned are sent to the subscriber
let flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
console.log(flags)
const readerMode$ = this.nfc.readerMode(flags).subscribe(
    tag => console.log(JSON.stringify(tag),"NFC"),
    err => console.log('Error reading tag', err)
);


// Read NFC Tag - iOS
// On iOS, a NFC reader session takes control from your app while scanning tags then returns a tag
try {
   let tag = await this.nfc.scanNdef();
   console.log(JSON.stringify(tag));
} catch (err) {
    console.log('Error reading tag', err);
}
this.subscriptions.push(readerMode$);
  }
  onSuccess(e){
      console.log(e)
  }
  onError(e){
    console.log(e)
  }
  goTomenu(): void {
    this.navigateService.goToMenu();
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
