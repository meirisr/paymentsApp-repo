import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
const COLOR_THEME = 'color-theme';
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  ischecked='false';
  constructor() { }

  onToggleColorTheme(event) {
    console.log(event);
    if (event.detail.checked) {
      document.body.setAttribute('color-theme', 'dark');
      Storage.set({ key: COLOR_THEME, value: 'true' });
      this.ischecked='true';
    } else {
      document.body.setAttribute('color-theme', 'light');
      Storage.set({ key: COLOR_THEME, value: 'false' });
      this.ischecked='false';
    }
  }
 async getUserTheme(){
  const themeColor = await Storage.get({ key: COLOR_THEME });
  // console.log(!!themeColor.value)
  if(themeColor.value==='true'){
    document.body.setAttribute('color-theme', 'dark');
    this.ischecked='true';
  }else{
    document.body.setAttribute('color-theme', 'light');
    this.ischecked='false';
  }
  }
}
