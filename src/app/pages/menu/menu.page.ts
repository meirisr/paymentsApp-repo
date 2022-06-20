import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/app/services/api/user-login.service';

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
  constructor(private router: Router) {
    document.querySelector('body').classList.remove('scanBg');
  }
  ngOnInit() {}

  settings() {
    this.router.navigate(['/settings']);
  }
  scan() {
    this.router.navigate(['/scan']);
  }
  map() {
    this.router.navigate(['/google-map']);
  }
  userDetails() {
    this.router.navigate(['/user-details']);
  }
  toggleDarkTheme(matchesMode) {
    this.prefersDark = matchesMode;
  }
}
