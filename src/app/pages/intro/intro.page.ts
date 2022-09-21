import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { LoginService } from 'src/app/services/login.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Subscription } from 'rxjs';
import { NavigateHlperService } from 'src/app/services/utils/navigate-hlper.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  private subscriptions: Subscription[] = [];
  items: any[] = [{ id: '333', name: 'meir' }];
  tempitems: any[] = [];
  selectedHotel: { id: string; name: string } = { id: '', name: '' };

  constructor(
    private authenticationService: AuthenticationService,
    private logInServer: LoginService,
    private storageService: StorageService,
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
    const allOrg$ = this.logInServer
      .getAllOrganizations()
      .subscribe(async (data) => {
        this.items.push(this.creatHotelObj(data.body));
        this.tempitems = [...this.items];
        console.log(data.body),
          async (err: Error) => {
            console.log(err);
          };
      });
    this.subscriptions.push(allOrg$);
  }
  async onCreditCardClick(): Promise<void> {
    if (this.logInServer.isCardHasDetails.value) {
      this.storageService.setHotelId('0');
      this.navigateService.goToMenu();
    } else {
      this.utils.presentModal('', 'עליך להכניס פרטי אשראי', '');
      this.navigateService.goToCCDetails();
    }
  }
  // toggleDarkTheme(matchesMode) {
  //   this.prefersDark = matchesMode;
  // }
  handleInput(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.tempitems = [
      ...this.items.filter((item) => {
        return item.name.toLowerCase().indexOf(query) > -1;
      }),
    ];
  }
  async onSelectHotel(): Promise<void> {
    const hotelId = this.selectedHotel.id;
    const hotelName = this.selectedHotel.name;
    const isPermitToOrg$ = this.logInServer
      .isUserPermitToOrganization(hotelId)
      .subscribe(async (data) => {
        if (data) {
          await this.utils.presentModal(
            'ברוכים הבאים',
            `הנך רשום ב ${hotelName}`,
            'chack'
          );
          this.navigateService.goToMenu();
        } else {
          await this.utils.presentModal(
            'לא נמצא',
            'עליך להכנס עם כרטיס אשראי',
            ''
          );
        }
      });
    (err: Error) => {
      console.log(err);
    };
    this.subscriptions.push(isPermitToOrg$);
    this.selectedHotel = { id: '', name: '' };
  }
  async onClickHotel(
    event: Event,
    item: { id: string; name: string }
  ): Promise<void> {
    const element = event.target as HTMLElement;
    this.selectedHotel = item;

    // await this.utils.presentModal('ברוכים הבאים',`הנך רשום ב ${item.id}`);
    // this.nav.navigateForward('/menu', { animationDirection: 'forward', animated: true })
  }

  creatHotelObj(data: { name: string; id: string }) {
    return { name: Object.values(data)[0], id: Object.keys(data)[0] };
  }
  goToLogin(): void {
    this.storageService.deleteAllStorege();
    this.authenticationService.isAuthenticated.next(false);
    window.location.reload();
  }
  ngOnDestroy(): void {
    this.selectedHotel = { id: '', name: '' };
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
