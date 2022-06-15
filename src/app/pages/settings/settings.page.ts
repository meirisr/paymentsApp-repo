import { Component, OnInit } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { ThemeService } from 'src/app/services/utils/theme.service';
const COLOR_THEME = 'color-theme';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  ischecked;
  constructor(private themeService: ThemeService) {
    this.ischecked=this.themeService.ischecked;
  }

  ngOnInit() {}
  onToggleColorTheme(event) {
    this.themeService.onToggleColorTheme(event);
    console.log(event);
    // if (event.detail.checked) {
    //   document.body.setAttribute('color-theme', 'dark');
    //   Storage.set({ key: COLOR_THEME, value: 'true' });
    // } else {
    //   document.body.setAttribute('color-theme', 'light');
    //   Storage.set({ key: COLOR_THEME, value: 'false' });
    // }
  }
}
