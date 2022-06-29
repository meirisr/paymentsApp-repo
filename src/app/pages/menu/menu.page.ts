import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/app/services/api/user-login.service';
import { SplashScreen } from '@capacitor/splash-screen';
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
    private apiUserServer: UserLoginService
  ) {
    document.querySelector('body').classList.remove('scanBg');
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
    this.apiUserServer.getUserDetails();
    this.apiUserServer.getCreditCardInfo();
    // this.apiUserServer.getUserDetails().then(()=>{
    //   this.apiUserServer.isUserHasDetails.pipe(
    //     filter((val) => val !== null),
    //     take(1),
    //     map((isUserHasDetails) =>{return isUserHasDetails;}))
    //   .subscribe((e)=>{
    //     if(e){
    //      return false;
    //     }
    //     else{
    //       this.router.navigateByUrl('/user-details', { replaceUrl: true });
    //     }
    //   });
    // });
  }
  ngAfterViewInit(): void {
    this.hideSplashScreen();
  }
 async hideSplashScreen(){
  await SplashScreen.hide();
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
