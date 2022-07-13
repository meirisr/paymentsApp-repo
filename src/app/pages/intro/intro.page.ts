import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { App } from '@capacitor/app';
import { StorageService } from 'src/app/services/storage.service';
import { LoginService } from 'src/app/services/login.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { filter, map,take } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';

const HOTEL_ID = 'my-hotel';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit{
  prefersDark;
  translaetPath;
  searchTerm;

  items = [
    // { name: 'מלון דן תל אביב', id: 'מלון דן תל אביב' },
    // { name: 'מלון כרמים', id: 'מלון כרמים' },
    // { name: 'מלון בראשית', id: 'מלון בראשית' },
    // { name: 'מלון פלאזה ים המלח', id: 'מלון פלאזה ים המלח' },
  ];
  tempitems ;
  // slide1Body ='ברוכים הבאים';

  constructor(
    private router: Router,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private logInServer: LoginService,
    private storageService: StorageService,
    private nav: NavController,
    private utils: UtilsService
  ) {
    // this.platform.backButton.subscribeWithPriority(10, () => {
    //   App.exitApp();
    // });
  }
  ngOnInit(): void {
    let loader=this.utils.showLoader();
    this.logInServer.getAllOrganizations().subscribe(async(data)=>{
      this.utils.dismissLoader(loader)
      this.items.push(this.creatHotelObj(data.body))
      this.tempitems= [...this.items];
      console.log(data.body),
      async(err)=>{
        this.utils.dismissLoader(loader)
        console.log(err)
      }
    }
    )
  }
 async next() {

    if (this.logInServer.isCardHasDetails.value) {
       this.utils.presentModal('ברוכים הבאים','');
      this.nav.navigateForward('/menu', { animationDirection: 'forward', animated: true })
    } else {
      this.utils.presentModal('','עליך להכניס פרטי אשראי');
      this.nav.navigateForward('/credit-card-details', { animationDirection: 'forward', animated: true })
    }
   
  }
  toggleDarkTheme(matchesMode) {
    this.prefersDark = matchesMode;
  }
  handleInput(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();

    this.tempitems = [
      ...this.items.filter((item) => {
        return item.name.toLowerCase().indexOf(query) > -1;
      }),
    ];
  }
 async onClickHotel(item) {
  let loader=this.utils.showLoader();
    // this.storageService.setStorege(HOTEL_ID, item.id);
    this.logInServer.isUserPermitToOrganization(item.id).subscribe(async(data)=>{
    this.utils.dismissLoader(loader)
      if(data){
        await this.utils.presentModal('ברוכים הבאים',`הנך רשום ב ${item.id}`);
        this.nav.navigateForward('/menu', { animationDirection: 'forward', animated: true })
      }else{
        await this.utils.presentModal('לא נמצא','עליך להכנס עם כרטיס אשראי');
      }
      console.log(data)
    })
    err=>{
      this.utils.dismissLoader(loader);
      console.log(err)
    }
    // await this.utils.presentModal('ברוכים הבאים',`הנך רשום ב ${item.id}`);
    // this.nav.navigateForward('/menu', { animationDirection: 'forward', animated: true })
  }



  creatHotelObj(data){
    return {name: Object.values(data)[0] , id: Object.keys(data)[0]  }
  }
  goToLogin() {
    this.storageService.deleteStorege();
    this.authenticationService.isAuthenticated.next(false);
    window.location.reload();
    // this.nav.navigateBack('/login',{ replaceUrl: true ,animationDirection: 'back', animated: true });
  }
}
