import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { from, Subject, Subscription } from 'rxjs';
import { NavController, Platform } from '@ionic/angular';
import { TravelProcessService } from 'src/app/services/travel-process.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements AfterViewInit {
  private subscriptions: Subscription[] = [];
  @ViewChild('polyline') polylineRef: ElementRef<HTMLElement>;
  @ViewChild('paymentBody') paymentBodyRef: ElementRef<HTMLElement>;
  @ViewChild('drowerBar') drowerBarRef: ElementRef<HTMLElement>;
  mapHight: string = '25vh';
  origin;
  destination;
  nearestStation = {
    lat: 0,
    lng: 0,
  };
  coordinates: [] = [];
  unsubscribe: Subject<void> = new Subject<void>();
  apiLoaded: boolean = false;
  numOfPassengers: number = 1;

  constructor(
    private platform: Platform,
    private navCtrl: NavController,
    private utils: UtilsService,
    private travelProcessService: TravelProcessService
  ) {
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.navCtrl.navigateRoot(['menu'], { replaceUrl: true });
    });
  }

  ngAfterViewInit(): void {
    console.log('pay');
    let routeInfoSubscription = this.travelProcessService.routeInfo.subscribe(
      async (data) => {
        if (!data) return;
        console.log(data);
        this.origin = data.firstStation;
        this.destination = data.lastStation;
      },
      async (error) => {
        console.log(error);
      }
    );
    this.subscriptions.push(routeInfoSubscription);
  }
  // onMove(detail) {
  //   const position = document.getElementById('paymentBody');
  //   const top = position.getBoundingClientRect().top;
  //   if (detail.deltaY >= 0) {
  //     if (this.convertPXToVh(top) <= 80 && detail.currentY <= 640) {
  //       this.paymentBodyRef.nativeElement.style.top =
  //         this.convertPXToVh(detail.currentY) + 'vh';
  //     }
  //   } else {
  //     if (this.convertPXToVh(detail.currentY) > 9) {
  //       this.paymentBodyRef.nativeElement.style.top =
  //         this.convertPXToVh(detail.currentY) + 'vh';
  //     }
  //   }
  // }
  convertPXToVh(px: number): number {
    return 100 * (px / document.documentElement.clientHeight);
  }
  convertVhTopx(vh: number): number {
    return (vh * document.documentElement.clientWidth) / 100;
  }
  addPassengers(): void {
    this.numOfPassengers += 1;
  }
  removePassengers(): void {
    if (this.numOfPassengers > 1) {
      this.numOfPassengers -= 1;
    }
  }
  async onSubmit(): Promise<void> {
    let loader = this.utils.showLoader();
    from(this.travelProcessService.paymentTranportation()).subscribe(
      async (data) => {
        this.utils.dismissLoader(loader);
        if (data.querySuccessful) {
          this.navCtrl.navigateRoot(['travel-route-tracking'], {
            replaceUrl: true,
          });
          await this.utils.presentModal('נסיעה טובה', 'החיוב בוצע בהצלחה');
        } else {
          await this.utils.presentModal('שגיאה', 'המערכת לא הצליחה לבצע חיוב');
        }
      },
      async(err) => {
        this.utils.dismissLoader(loader);
        await this.utils.presentModal('שגיאה', 'המערכת לא הצליחה לבצע חיוב');
        console.log(err);
      }
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
