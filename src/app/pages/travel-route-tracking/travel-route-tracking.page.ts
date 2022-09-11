import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Gesture, GestureController, NavController, Platform } from '@ionic/angular';
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
  isShow: boolean = true;
  noData:boolean=false;
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
    public navCtrl: NavController,
    private travelProcessService: TravelProcessService
  ) {
    // this.platform.backButton.subscribeWithPriority(10, () => {
    //   this.nav.navigateBack('/menu', { replaceUrl: true });
    // });
  }

  ngOnInit() {
    this.noData=false;
  }
  ngAfterViewInit(): void {
    let routeInfoSubscription = this.travelProcessService.routeInfo.subscribe(
      async (data) => {
        console.log(data)
        if (!data){
         this.noData=true;
          return;
        }
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
        // onEnd: (ev) => this.onEnd(ev),
      },
      true
    );
    gesture.enable();
  }
  onMove(detail) {
    if (detail.deltaY > 0) {
      this.travelBodyRef.nativeElement.classList.add('OpenBig');

      // if(!position.scrollTop && detail.deltaY>0){
      //   this.travelBodyRef.nativeElement.classList.add('OpenBig')
      // }else{
      //   this.travelBodyRef.nativeElement.classList.remove('OpenBig')
      // }
      // const position = document.getElementById('body-card-1');

      // if (detail.currentY > this.minHight - 40 || detail.currentY < 70) {
      //   return;
      // }

      // if (!position.scrollTop && detail.deltaY > 0) {
      //   this.travelBodyRef.nativeElement.style.top = 93 + 'vh';
      // }
    }
  }
  onEnd(detail) {}

  onClick(): void {
    // const position = document.getElementById('drowerBar');
    // const top = position.getBoundingClientRect().top;

    this.travelBodyRef.nativeElement.classList.toggle('OpenBig');
    const position = document.getElementById('body-card-1');
    position.scrollTop = 0;

    // this.travelBodyRef.nativeElement.style.height =
    //   this.convertPXToVh(top) > 60 ? 10 + 'vh' : 93 + 'vh';
  }
  onEndTrip(){
    this.travelProcessService.routeInfo.next(false);
    this.navCtrl.navigateRoot(['menu'], { replaceUrl: true });
  }
  showHideTravelBody() {
    this.isShow = !this.isShow;
    this.travelBodyRef.nativeElement.classList.toggle('close');
    const position = document.getElementById('body-card-1');
    position.scrollTop = 0;
    // this.showHideIconRef.nativeElement.classList.toggle('show')
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
