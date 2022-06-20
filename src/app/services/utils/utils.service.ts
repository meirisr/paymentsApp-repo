import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { LoadingController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { promise } from 'protractor';
const COLOR_THEME = 'color-theme';
const USER_LANGUAGE = 'user-language';
@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  ischecked = 'false';

  defaultLang;

  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    private translate: TranslateService
  ) {}

  onToggleColorTheme(event) {
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
    const loading = await this.loadingController.create();
    await loading.present();
    return loading;
  }
  async dismissLoader(loader) {
    loader.then((e) => e.dismiss());
  }
  async showalert(e, header) {
    const alert = await this.alertController.create({
      header: 'Login failed',
      message: e.error.error.errorMessage['en-us'],
      buttons: ['OK'],
    });
    await alert.present();
  }
}
