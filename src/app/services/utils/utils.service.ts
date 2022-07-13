import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PopupModalComponent } from 'src/app/components/popup-modal/popup-modal.component';
const COLOR_THEME = 'color-theme';
const USER_LANGUAGE = 'user-language';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  ischecked = 'false';

  defaultLang;

  constructor(
    public loadingController: LoadingController,
    private alertController: AlertController,
    private translate: TranslateService,
    private modalController: ModalController,
  ) {}

  onToggleColorTheme(event) {
    let drowerDiv = document.getElementById('travelBody');
    if (event.detail.checked) {
      document.body.setAttribute('color-theme', 'dark');

      Storage.set({ key: COLOR_THEME, value: 'true' });
      this.ischecked = 'true';
    } else {
      document.body.setAttribute('color-theme', 'light');

      Storage.set({ key: COLOR_THEME, value: 'false' });
      this.ischecked = 'false';
    }
  }
  onToggleLanguages(event) {
    switch (event.detail.value) {
      case 'en':
        this.translate.use('en');
        Storage.set({ key: USER_LANGUAGE, value: 'en' });

        this.defaultLang = 'en';
        break;
      case 'he':
        this.translate.use('he');
        Storage.set({ key: USER_LANGUAGE, value: 'he' });

        this.defaultLang = 'he';
        break;
      default:
        this.translate.use('he');
        Storage.set({ key: USER_LANGUAGE, value: 'he' });
        this.defaultLang = 'he';
        break;
    }
  }
  async getUserTheme() {
    const themeColor = await Storage.get({ key: COLOR_THEME });
    if (themeColor.value === 'true') {
      document.body.setAttribute('color-theme', 'dark');

      this.ischecked = 'true';
    } else {
      document.body.setAttribute('color-theme', 'light');

      this.ischecked = 'false';
    }
  }
  async getUserLanguage() {
    const userLang = await Storage.get({ key: USER_LANGUAGE });
    if (userLang.value === 'en') {
      this.translate.use('en');

      this.defaultLang = 'en';
    } else {
      this.translate.use('he');

      this.defaultLang = 'he';
    }
  }
  async showLoader() {
    const loading = await this.loadingController.create({
      // message: 'Loading...',
      // duration: 3000,
      spinner: 'bubbles',
      cssClass: 'loader'
    });
    await loading.present();
    return loading;
  }
  async dismissLoader(loader) {
    loader.then((e) => e.dismiss());
  }
  async showalert(e, header) {
    const userLang = await Storage.get({ key: USER_LANGUAGE });
    let language= userLang.value=='en'?'en-us':'he-il'
    
    const alert = await this.alertController.create({
      header: 'Login failed',
      message: e?.error?.error?.errorMessage
        ? e?.error?.error?.errorMessage[language]
        : e?.error?.errorMessage
        ? e?.error?.errorMessage[language]
        : 'Due to networking error the request could not be fulfilled. Please retry in a few seconds',
      buttons: ['OK'],
    });
    await alert.present();
  }


  async presentModal(header,text) {
    const modal = await this.modalController.create({
      component: PopupModalComponent,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      componentProps: {
        header:header,
        typy: 'login-success',
        text:text
      },
    });
    modal.present();
    setTimeout(() => {
      modal.dismiss({
        dismissed: true,
      });
    }, 3000);
  }
}
