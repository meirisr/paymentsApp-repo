import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/app/services/api/user-login.service';
import { filter, map, take } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
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
  constructor(private router: Router, private apiUserServer: UserLoginService) {
    document.querySelector('body').classList.remove('scanBg');
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

  settings() {
    this.router.navigate(['/settings']);
  }
  scan() {
    this.router.navigate(['/scan']);
  }
  map() {
    this.router.navigate(['/google-map']);
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
