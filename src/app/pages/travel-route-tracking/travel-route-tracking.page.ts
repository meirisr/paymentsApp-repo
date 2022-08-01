import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { PopupModalComponent } from '../../components/popup-modal/popup-modal.component';
import { Gesture, GestureController, Platform } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { TravelProcessService } from 'src/app/services/travel-process.service';
import { from, Subscription } from 'rxjs';

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
  mapHight = '100vh';
  startHight = 75;
  maxHight = 20;
  minHight;
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
    private logInServer: LoginService,
    private modalController: ModalController,
    private router: Router,
    private platform: Platform,
    private nav: NavController,
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
      // this.convertPXToVh(detail.currentY-10) + 'vh';
    }
  }
  onEnd(detail) {}
  onClick() {
    const position = document.getElementById('drowerBar');
    const top = position.getBoundingClientRect().top;
    console.log(this.convertPXToVh(top));
    this.travelBodyRef.nativeElement.style.top =
      this.convertPXToVh(top) > 60 ? 10 + 'vh' : 93 + 'vh';
  }
  convertPXToVh(px) {
    return 100 * (px / document.documentElement.clientHeight);
  }
  convertVhTopx(vh) {
    return (vh * document.documentElement.clientWidth) / 100;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
