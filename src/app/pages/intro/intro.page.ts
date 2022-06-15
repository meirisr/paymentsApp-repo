import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { INTRO_KEY } from 'src/app/guards/intro.guard';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  prefersDark;
  constructor(private router: Router) {
    this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.toggleDarkTheme(this.prefersDark.matches);
    window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
      this.toggleDarkTheme(e);
    });
  }

  ngOnInit() {
    // setTimeout(() => this.slides.slideNext(), 2000);
    setTimeout(() => this.router.navigate(['/login']), 1000);
  }
  next() {
    // this.slides.slideNext();
    this.router.navigate(['/google-map']);
  }
  async start() {
    await Storage.set({ key: INTRO_KEY, value: 'true' });
    this.router.navigate(['/scan']);
    // this.router.navigateByUrl('/login', { replaceUrl:true });
  }
  toggleDarkTheme(matchesMode) {
    this.prefersDark = matchesMode;
  }
}
