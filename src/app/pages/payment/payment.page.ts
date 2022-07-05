import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

import { UserLoginService } from 'src/app/services/api/user-login.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements AfterViewInit {
  @ViewChild('polyline') polylineRef: ElementRef<HTMLElement>;
  @ViewChild('paymentBody') paymentBodyRef: ElementRef<HTMLElement>;
  @ViewChild('drowerBar') drowerBarRef: ElementRef<HTMLElement>;
  mapHight = '27vh';
  origin = 'שדה התעופה בן גוריון';
  destination = 'מלון בראשית';
  Coordinates: [];
  unsubscribe = new Subject<void>();
  apiLoaded = false;
  numOfPassengers = 1;

  constructor(
    private router: Router,
    private platform: Platform,
    private apiUserServer: UserLoginService
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['/menu']);
    });
    // this.Coordinates = this.apiUserServer.Coordinates;
    this.apiUserServer.getTravel().subscribe(async () => {
      this.Coordinates = this.apiUserServer.Coordinates;
    });
  }

  ngAfterViewInit(): void {}
  onMove(detail) {
    const position = document.getElementById('paymentBody');
    const top = position.getBoundingClientRect().top;
    if (detail.deltaY >= 0) {
      if (this.convertPXToVh(top) <= 80 && detail.currentY <= 640) {
        this.paymentBodyRef.nativeElement.style.top =
          this.convertPXToVh(detail.currentY) + 'vh';
        // this.mapHight = top + 90;
      }
    } else {
      if (this.convertPXToVh(detail.currentY) > 9) {
        this.paymentBodyRef.nativeElement.style.top =
          this.convertPXToVh(detail.currentY) + 'vh';
        // this.mapHight = top + 90;
      }
    }
  }
  convertPXToVh(px) {
    return 100 * (px / document.documentElement.clientHeight);
  }
  convertVhTopx(vh) {
    return (vh * document.documentElement.clientWidth) / 100;
  }
  addPassengers() {
    this.numOfPassengers += 1;
  }
  removePassengers() {
    if (this.numOfPassengers > 1) {
      this.numOfPassengers -= 1;
    }
  }
  onSubmit() {
    this.router.navigate(['/travel-route-tracking']);
  }
}
