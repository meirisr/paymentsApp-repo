import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { LoginService } from 'src/app/services/login.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Subscription } from 'rxjs';
import { NavigateHlperService } from 'src/app/services/utils/navigate-hlper.service';
import { UserInfoService } from 'src/app/services/user-info.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  private subscriptions: Subscription[] = [];
  items: any[] = [];
  tempitems: any[] = [];
  selectedHotel: { id: string; name: string } = { id: '', name: '' };

  constructor(
    private authenticationService: AuthenticationService,
    private logInServer: LoginService,
    private storageService: StorageService,
    private userInfoServer: UserInfoService,
    private utils: UtilsService,
    private navigateService: NavigateHlperService,
    private platform: Platform,
    public navCtrl: NavController
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      navigator['app'].exitApp();
    });
  }
  ngOnInit(): void {
    this.storageService.deleteHotelId();
    this.storageService.deleteHotelName();
    const allOrg$ = this.logInServer
      .getAllOrganizations()
      .subscribe(async (data) => {
      
       
        this.items =[...Object.entries(data.body).map(item=>this.creatHotelObj(item))]
        this.tempitems = [...this.items];
        console.log( this.tempitems)
        async (err: Error) => {
          console.log(err);
        };
      });
    this.subscriptions.push(allOrg$);
  }
  async onCreditCardClick(): Promise<void> {
       this.storageService.setHotelId('0');
       this.storageService.setHotelName('תשלום פרטי');
    if (this.userInfoServer.isCardHasDetails.value) {
      // this.storageService.setHotelId('0');
      this.navigateService.goToMenu();
    } else {
      await this.utils.presentModal('', 'עליך להכניס פרטי אשראי', '');
      setTimeout(() => {
        this.utils.dismissModal();
      }, 2000);
      this.navigateService.goToCCDetails();
    }
  }
  handleInput(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.tempitems = [
      ...this.items.filter((item) => {
        return item.name.toLowerCase().indexOf(query) > -1;
      }),
    ];
  }
  async onSubmit(): Promise<void> {
    const hotelId = this.selectedHotel.id;
    const hotelName = this.selectedHotel.name;
    if(hotelId==='')return;
    this.storageService.setHotelId(hotelId);
   this.storageService.setHotelName(hotelName);
   if(hotelId==='0'){
    // this.storageService.setHotelId('0');
    // this.navigateService.goToMenu();
    this.onCreditCardClick()
   }else{
    this.navigateService.goToMenu();
    // const isPermitToOrg$ = this.logInServer
  //   .isUserPermitToOrganization(hotelId, hotelName)
  //   .subscribe(
  //     async (data) => {
  //       if (data) {
  //         this.storageService.setHotelId(hotelId);
  //         this.storageService.setHotelName(hotelName);
  //         await this.utils.presentModal(
  //           'ברוכים הבאים',
  //           `הנך רשום ב ${hotelName}`,
  //           'chack'
  //         );
  //         setTimeout(() => {
  //           this.utils.dismissModal();
  //         }, 2000);
  //         this.navigateService.goToMenu();
  //       } else {
  //         await this.utils.presentModal(
  //           'לא נמצא',
  //           'עליך להכנס עם כרטיס אשראי',
  //           ''
  //         );
  //         setTimeout(() => {
  //           this.utils.dismissModal();
  //         }, 2000);
  //       }
  //     },
  //     (err: Error) => {
  //       console.log(err);
  //     }
  //   );
  // this.subscriptions.push(isPermitToOrg$);
   }
    this.selectedHotel = { id: '', name: '' };
  }
  async onClickHotel(
    event: Event,
    item: { id: string; name: string }
  ): Promise<void> {
    const element = event.target as HTMLElement;
    this.selectedHotel = item;
  }

  creatHotelObj(data) {
    return { name: data[1], id: data[0] };
  }
  goToLogin(): void {
    this.storageService.deleteAllStorege();
    this.authenticationService.isAuthenticated$.next(false);
    window.location.reload();
  }
  ngOnDestroy(): void {
    this.selectedHotel = { id: '', name: '' };
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
