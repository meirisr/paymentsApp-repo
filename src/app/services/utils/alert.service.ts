import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private alertController: AlertController) {}

  async cameraPermissionAlert(deteails: {
    header: string;
    message: string;
    cancelHandler?: any;
    okHandler?: any;
  }) {
    const alert = await this.alertController.create({
      header: deteails.header,
      message: deteails.message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: deteails.cancelHandler,
        },
        {
          text: 'Ok',
          handler: deteails.okHandler,
        },
      ],
    });
    await alert.present();
  }
}
