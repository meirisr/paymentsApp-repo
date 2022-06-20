import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  BarcodeScanner,
  SupportedFormat,
} from '@capacitor-community/barcode-scanner';
import { Capacitor } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit, AfterViewInit, OnDestroy {
  scanActive = false;
  scanNotAllowed = false;
  result = null;
  element;
  constructor(
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (Capacitor.isNativePlatform()) {
      BarcodeScanner.prepare();
      this.startScanner();
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
    // setTimeout(() => {

    // }, 300);
    const allowed = await this.checkPermission();
    if (allowed) {
      this.scanActive = true;
      BarcodeScanner.hideBackground();
      const result = await BarcodeScanner.startScan({
        targetedFormats: [SupportedFormat.QR_CODE],
      });
      if (result.hasContent) {
        this.result = result.content;
        console.log(result);
        this.scanActive = false;
      }
      document.querySelector('body').classList.add('scanBg');
    }
  }
  async checkPermission() {
    const status = await BarcodeScanner.checkPermission({ force: true });
    if (status.granted) {
      return true;
    } else if (status.denied) {
      // the user denied permission for good
      // redirect user to app settings if they want to grant it anyway
      const c = confirm(
        'If you want to grant permission for using your camera, enable it in the app settings.'
      );
      if (c) {
        BarcodeScanner.openAppSettings();
      } else {
        navigator['app'].exitApp();
      }
    }
  }

  stopScanner() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }
}
