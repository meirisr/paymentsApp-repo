import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { INTRO_KEY } from 'src/app/guards/intro.guard';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  prefersDark;

  constructor(private menu: MenuController, private router: Router) {}
  ngOnInit() {
    Storage.set({ key: INTRO_KEY, value: 'true' });
    this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.toggleDarkTheme(this.prefersDark.matches);
    window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
      this.toggleDarkTheme(e);
    });
    // this.prefersDark.addListener((mediaQuery) => this.toggleDarkTheme(mediaQuery.matches));
  }
  async openMenu() {
    this.menu.enable(true, 'main');
    await this.menu.open('main');
  }
  scan() {
    this.router.navigate(['/scan']);
  }
  map() {
    this.router.navigate(['/google-map']);
  }
  toggleDarkTheme(matchesMode) {
    this.prefersDark = matchesMode;
  }
}
