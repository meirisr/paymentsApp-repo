import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils/utils.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  ischecked: string;
  defaultLang: string;
  constructor(private utils: UtilsService, private navCtrl: NavController) {
    this.ischecked = this.utils.ischecked;
    this.defaultLang = this.utils.defaultLang;
  }

  ngOnInit() {}

  onToggleLanguages(event) {
    this.utils.onToggleLanguages(event);
  }
  radioGroupChange(event: Event) {
    this.utils.onToggleLanguages(event);
    window.location.reload();
  }
  goToMenu() {
    this.navCtrl.navigateRoot(['/menu'], { replaceUrl: true });
  }
}
