import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Gesture, GestureController, Platform } from '@ionic/angular';
import { TravelProcessService } from 'src/app/services/travel-process.service';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';
import { NavigateHlperService } from 'src/app/services/utils/navigate-hlper.service';

@Component({
  selector: 'app-travel-route-tracking',
  templateUrl: './travel-route-tracking.page.html',
  styleUrls: ['./travel-route-tracking.page.scss'],
})
export class TravelRouteTrackingPage implements OnInit {
  private subscriptions: Subscription[] = [];

  @ViewChild('polyline') polylineRef: ElementRef<HTMLElement>;
  @ViewChild('travelBody') travelBodyRef: ElementRef<HTMLElement>;
  @ViewChild('drowerBar') drowerBarRef: ElementRef<HTMLElement>;
  @ViewChild('dated') datedRef: ElementRef<HTMLElement>;
  isShow: boolean = true;
  hideItems: boolean = true;
  noData: boolean = false;
  mapHight: string = '100vh';
  startHight: number = 8;
  maxHight: number = 22;
  minHight: number;
  coordinates: [] = [];
  allStations: any[] = [];
  origin: string;
  destination: string;
  nearestStation: { lat: number; lng: number } = {
    lat: 0,
    lng: 0,
  };

  constructor(
    private plt: Platform,
    private gestureCtrl: GestureController,
    private navigateService: NavigateHlperService,
    private storageService: StorageService,
    private travelProcessService: TravelProcessService
  ) {
    this.plt.backButton.subscribeWithPriority(10, () => {
      this.navigateService.goToMenu();
    });
  }

  ngOnInit() {
    this.noData = false;
    let routeInfoSubscription = this.travelProcessService.paymentTrip.subscribe(
      async (data) => {
        if (!data) {
          this.noData = true;
          return;
        }
        this.noData = false;
        this.origin = data.firstStation;
        this.destination = data.lastStation;
        this.allStations = data.stationArray;
      },
      async (error) => {
        console.log(error);
      }
    );
    this.subscriptions.push(routeInfoSubscription);
  }
  ngAfterViewInit(): void {
   
  }

  ionViewDidEnter(): void {
    this.travelBodyRef.nativeElement.style.top = this.startHight + 'vh';
    this.minHight = this.plt.height();

    const gesture: Gesture = this.gestureCtrl.create(
      {
        el: this.travelBodyRef.nativeElement,
        threshold: 0,
        gestureName: 'my-gesture',
        onMove: (ev) => this.onMove(ev),
      },
      true
    );
    gesture.enable();
  }
  onMove(detail) {
    if (detail.deltaY > 0) {
      this.travelBodyRef.nativeElement.classList.add('OpenBig');
      this.hideItems = false;
    }
  }
  onClick(): void {
    this.travelBodyRef.nativeElement.classList.toggle('OpenBig');
    this.hideItems = !this.hideItems;
    const position = document.getElementById('body-card-1');
    position.scrollTop = 0;
  }
  onEndTrip() {
    this.travelProcessService.paymentTrip.next(false)
    this.travelProcessService.routeInfo.next(false);
    this.storageService.deleteRouteDetails();
    this.navigateService.goToMenu();
  }
  showHideTravelBody() {
    this.isShow = !this.isShow;
    this.travelBodyRef.nativeElement.classList.toggle('close');
    const position = document.getElementById('body-card-1');
    position.scrollTop = 0;
  }

  convertPXToVh(px: number): number {
    return 100 * (px / document.documentElement.clientHeight);
  }
  convertVhTopx(vh: number): number {
    return (vh * document.documentElement.clientWidth) / 100;
  }
  emitEventToChild(id:string) {
    this.travelProcessService.stationInfo.next(id);
    this.travelBodyRef.nativeElement.classList.remove('OpenBig');
    this.hideItems = true;
    const position = document.getElementById('body-card-1');
    position.scrollTop = 0;
  }

  ngOnDestroy(): void {
    this.travelProcessService.stationInfo.next(null);
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
