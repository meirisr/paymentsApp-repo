import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';
const COLOR_THEME = 'color-theme';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  ischecked;
  ischecked2;
  defaultLang;
  constructor(private utils: UtilsService,private router:Router) {
    this.ischecked=this.utils.ischecked;

    this.defaultLang=this.utils.defaultLang;
    console.log(this.defaultLang);
  }

  ngOnInit() {}
  onToggleColorTheme(event) {
    this.utils.onToggleColorTheme(event);
    console.log(event);
  }
  onToggleLanguages(event) {
    this.utils.onToggleLanguages(event);
  }
  radioGroupChange(event){
    this.utils.onToggleLanguages(event);
  }
  goToMenu() {
    this.router.navigate(['/menu']);
  }
}
