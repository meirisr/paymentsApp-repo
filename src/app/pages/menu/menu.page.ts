import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { INTRO_KEY } from 'src/app/guards/intro.guard';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { UserLoginService } from 'src/app/services/api/user-login.service';
import { from } from 'rxjs';

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
  constructor(
    private menu: MenuController,
    private router: Router,
    private apiUserServer: UserLoginService
  ) {}
  ngOnInit() {
    // this.prefersDark.addListener((mediaQuery) => this.toggleDarkTheme(mediaQuery.matches));
  }
  // async openMenu() {
  //   this.menu.enable(true, 'main');
  //   await this.menu.open('main');
  // }
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
