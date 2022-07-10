import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { AlertController, IonRouterOutlet, Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/app/services/api/user-login.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { App } from '@capacitor/app';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit, AfterViewInit {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet;
  prefersDark;
  userDetalis: object;
  mapOptions: google.maps.MapOptions = {
    center: { lat: 31.79476, lng: 35.18761 },
    zoom: 16,
  };
  constructor(
    private router: Router,
    private apiUserServer: UserLoginService,
    private utils: UtilsService,
    private platform: Platform,
    private alertController: AlertController,
  ) {
    document.querySelector('body').classList.remove('scanBg');
    this.apiUserServer.getUserDetails().subscribe();

    // this.platform.backButton.subscribeWithPriority(10, () => {
    //    console.log("back")
    //   let message='האם אתה רוצה לצאת '
    //   this.showAlert(message);
       
    // });
  }
  ngOnInit() {
  
    // this.apiUserServer.getUserDetails().subscribe();
    // this.apiUserServer.getCreditCardInfo();
  }
  ngAfterViewInit(): void {
    this.hideSplashScreen();
  }
 async hideSplashScreen(){
 }
  settings() {
    this.router.navigate(['/settings']);
  }
  scan() {
    this.router.navigate(['/scan']);
  }
  map() {
    this.router.navigate(['/payment']);
  }
  logOut(){
    this.utils.deleteStorege()
    this.apiUserServer.isAuthenticated.next(false);

    window.location.reload();
  }

  userProfile() {
    this.router.navigate(['/user-profile']);
  }
  creditCardDetails() {
    this.router.navigate(['/credit-card-details']);
  }
  toggleDarkTheme(matchesMode) {
    this.prefersDark = matchesMode;
  }
  async showAlert(message) {
    const alert = await this.alertController.create({
      header: 'מיקום כבוי',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Ok',
          handler: () => {
            App.exitApp();
          },
        },
      ],
    });
    await alert.present();
  }
}
