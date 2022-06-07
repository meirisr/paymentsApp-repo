import { Component, OnInit } from '@angular/core';
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
export class ScanPage implements OnInit {
  scanActive = false;
  scanNotAllowed=false;
  result = null;
  element;
  constructor(private alertController: AlertController,private router: Router) {}

  ngOnInit() {}
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit() {
    if (Capacitor.isNativePlatform()) {
      BarcodeScanner.prepare();
      this.startScanner();
      this.scanNotAllowed=false;
    }
    else{
      this.scanNotAllowed=true;
      setTimeout(()=>{
        this.router.navigate(['/menu']);
      },3000);
    }
  }
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy() {
    document.querySelector('body').classList.remove('scanBg');
    if (Capacitor.isNativePlatform()) {
      BarcodeScanner.stopScan();
    }
    this.scanNotAllowed=false;
  }
  async startScanner() {
    document.querySelector('body').classList.add('scanBg');
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
    }
  }
  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        const alert = await this.alertController.create({
          header: 'No permission',
          message: 'Pleas allow camera access in your settings',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
            },
            {
              text: 'Open Settings',
              handler: () => {
                resolve(false);
                BarcodeScanner.openAppSettings();
              },
            },
          ],
        });
        await alert.prepend();
      } else {
        resolve(false);
      }
    });
  }

  stopScanner() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }
}
