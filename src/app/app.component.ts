import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, IonRouterOutlet } from '@ionic/angular';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { UtilsService } from './services/utils/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { UserLoginService } from './services/api/user-login.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet;
  apiLoaded = false;
  constructor(
    private platform: Platform,
    private location: Location,
    private httpClient: HttpClient,
    private utils: UtilsService,
    private translate: TranslateService,
    private apiUserServer: UserLoginService
  ) {
    translate.setDefaultLang('en');
    translate.use('he');

    this.platform.backButton.subscribeWithPriority(10, () => {
      if (!this.routerOutlet.canGoBack()) {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        navigator['app'].exitApp();
      } else {
        this.location.back();
      }
    });
    const key = environment.googleMapsKey;
    this.httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${key}&language=en`,
        'callback'
      )
      .pipe(
        map(() => true),
        catchError(() => of(false))
      )
      .subscribe((result) => {
        this.apiLoaded = result;
      });
  }
  ngOnInit() {
    this.utils.getUserTheme();
    this.utils.getUserLanguage();
  }
}
