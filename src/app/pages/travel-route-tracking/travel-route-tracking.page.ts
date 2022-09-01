import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Gesture, GestureController, Platform } from '@ionic/angular';
import { TravelProcessService } from 'src/app/services/travel-process.service';
import { Subscription } from 'rxjs';

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
  mapHight: string = '100vh';
  startHight: number = 75;
  maxHight: number = 20;
  minHight: number;
  allStations: any[] = [];
  origin;
  destination;
  nearestStation = {
    lat: 0,
    lng: 0,
  };

  constructor(
    private plt: Platform,
    private gestureCtrl: GestureController,
    private travelProcessService: TravelProcessService
  ) {
    // this.platform.backButton.subscribeWithPriority(10, () => {
    //   this.nav.navigateBack('/menu', { replaceUrl: true });
    // });
  }

  ngOnInit() {}
  ngAfterViewInit(): void {
    let routeInfoSubscription = this.travelProcessService.routeInfo.subscribe(
      async (data) => {
        if (!data) return;
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

  ionViewDidEnter(): void {
    this.travelBodyRef.nativeElement.style.top = this.startHight + 'vh';
    this.minHight = this.plt.height();

    const gesture: Gesture = this.gestureCtrl.create(
      {
        el: this.travelBodyRef.nativeElement,
        threshold: 0,
        gestureName: 'my-gesture',
        onMove: (ev) => this.onMove(ev),
        onEnd: (ev) => this.onEnd(ev),
      },
      true
    );
    gesture.enable();
  }
  onMove(detail) {
    console.log(detail);
    const position = document.getElementById('body-card-1');

    if (detail.currentY > this.minHight - 40 || detail.currentY < 70) {
      return;
    }

    if (!position.scrollTop && detail.deltaY > 0) {
      this.travelBodyRef.nativeElement.style.top = 93 + 'vh';
    }
  }
  onEnd(detail) {}
  onClick(): void {
    const position = document.getElementById('drowerBar');
    const top = position.getBoundingClientRect().top;
    console.log(this.convertPXToVh(top));
    this.travelBodyRef.nativeElement.style.top =
      this.convertPXToVh(top) > 60 ? 10 + 'vh' : 93 + 'vh';
  }
  convertPXToVh(px: number): number {
    return 100 * (px / document.documentElement.clientHeight);
  }
  convertVhTopx(vh: number): number {
    return (vh * document.documentElement.clientWidth) / 100;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
