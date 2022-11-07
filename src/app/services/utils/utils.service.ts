import { Injectable } from '@angular/core';
import { GetResult, Storage } from '@capacitor/storage';
import {
  LoadingController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PopupModalComponent } from 'src/app/components/popup-modal/popup-modal.component';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TravelProcessService } from '../travel-process.service';
import { StorageService } from '../storage.service';
import { App } from '@capacitor/app';
const USER_LANGUAGE = 'user-language';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  ischecked: string = 'false';
  apiLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userLang: GetResult;
  defaultLang: string;
  isLoading: boolean = false;

  constructor(
    private httpClient: HttpClient,
    public loadingController: LoadingController,
    private alertController: AlertController,
    private translate: TranslateService,
    private modalController: ModalController,
    private storageService: StorageService,
    private travelProcessService: TravelProcessService
  ) {}

  onToggleLanguages(event: any): void {
    switch (event.detail.value) {
      case 'en':
        this.translate.use('en');
        Storage.set({ key: USER_LANGUAGE, value: 'en' });
        this.userLang.value = 'en';
        this.defaultLang = 'en';
        break;
      case 'he':
        this.translate.use('he');
        Storage.set({ key: USER_LANGUAGE, value: 'he' });
        this.userLang.value = 'he';

        this.defaultLang = 'he';
        break;
      // default:
      //   this.translate.use('he');
      //   Storage.set({ key: USER_LANGUAGE, value: 'he' });
      //   this.defaultLang = 'he';
      //   this.userLang.value = 'he';
      //   break;
    }
  }

  async getUserLanguage(): Promise<string> {
    this.userLang = await Storage.get({ key: USER_LANGUAGE });
    if (this.userLang.value =='en') {
      this.translate.use('en');
      this.defaultLang ='en';
      return 'en';
    } else {
      this.translate.use('he');
      this.defaultLang='he';
      return 'he';
    }
  }
  async loadRoute() {
    const routeData = JSON.parse(
      (await this.storageService.getRuteDetails()).value
    );
    if (routeData) {
      this.travelProcessService.routeInfo.next(routeData);
    } else {
      this.travelProcessService.routeInfo.next(false);
    }
  }
  async loadGoogleMap(): Promise<void> {
    const key = environment.googleMapsKey;
    this.httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${key}&language=${this.userLang.value}`,
        'callback'
      )
      .pipe(
        map(() => true),
        catchError(() => of(false))
      )
      .subscribe(
        () => {
          this.apiLoaded.next(true);
        },
        () => {
          this.apiLoaded.next(false);
          this.loadGoogleMap();
        }
      );
  }

  async showalert(e?: any, header?: string): Promise<void> {
    const userLang = await Storage.get({ key: USER_LANGUAGE });
    let language = userLang.value == 'en' ? 'en-us' : 'he-il';
    console.log(e);
    const alert = await this.alertController.create({
      header: 'Error',
      message: e?.error?.error?.errorMessage
        ? e?.error?.error?.errorMessage[language]
        : e?.error?.errorMessage
        ? e?.error?.errorMessage[language]
        : 'עקב שגיאת רשת לא ניתן היה למלא את הבקשה. אנא נסה שוב בעוד מספר שניות',
      cssClass: language == 'en' ? 'en-alert' : 'he-alert',
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            console.log(e);
            App.exitApp();
          },
        },
      ],
    });
    await alert.present();
  }

  async presentModal(
    header: string,
    text: string,
    type: string,
    close: boolean = false
  ): Promise<void> {
    const modal = await this.modalController.create({
      component: PopupModalComponent,
      cssClass: 'my-custom-class',
      // swipeToClose: true,
      componentProps: {
        header: header,
        text: text,
        type: type,
      },
      backdropDismiss: close,
    });
    modal.present();
  }
  dismissModal() {
    setTimeout(() => {
      this.modalController.dismiss({
        dismissed: true,
      });
    }, 0);
  }

  async presentLoader() {
    const loading = await this.loadingController.create({
      translucent: true,
      cssClass: 'custom-class custom-loading',
    });
    this.isLoading = true;
    loading.present();
  }
  dismissLoader() {
    if (this.isLoading) {
      this.isLoading = false;
      setTimeout(() => {
        this.loadingController.dismiss({
          dismissed: true,
        });
      }, 0);
    }
  }
}
