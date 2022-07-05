import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/app/services/api/user-login.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { UtilsService } from 'src/app/services/utils/utils.service';
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
  //   markerOptions: google.maps.MarkerOptions = {
  //     draggable: false,
  //     clickable: true,
  //     icon: {
  //       url:'../../../assets/isr-logo-black.svg' ,
  //       scale:2,
  //     },
  //   };
  constructor(
    private router: Router,
    private apiUserServer: UserLoginService,
    private utils: UtilsService,
  ) {
    document.querySelector('body').classList.remove('scanBg');
    // this.apiUserServer.getUserDetails().subscribe();
    // this.platform.backButton.subscribeWithPriority(10, () => {
    //   // if (!this.routerOutlet.canGoBack()) {
    //   //   // eslint-disable-next-line @typescript-eslint/dot-notation
    //   //   navigator['app'].exitApp();
    //   // } else {
    //     console.log(this.location);
    //     this.location.back();
    //   // }
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
  // await SplashScreen.hide();
 }
  settings() {
    this.router.navigate(['/settings']);
  }
  scan() {
    this.router.navigate(['/scan']);
  }
  map() {
    this.router.navigate(['/payment'],);
  }
  logOut(){
    this.utils.deleteStorege()
    this.apiUserServer.isAuthenticated.next(false)
    this.router.navigate(['/'],);
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
}
