import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PopupModalComponent } from '../../components/popup-modal/popup-modal.component';
import { Gesture, GestureController, Platform } from '@ionic/angular';
import { UserLoginService } from 'src/app/services/api/user-login.service';

@Component({
  selector: 'app-travel-route-tracking',
  templateUrl: './travel-route-tracking.page.html',
  styleUrls: ['./travel-route-tracking.page.scss'],
})
export class TravelRouteTrackingPage implements OnInit{
  @ViewChild('polyline') polylineRef: ElementRef<HTMLElement>;
  @ViewChild('travelBody') travelBodyRef: ElementRef<HTMLElement>;
  @ViewChild('drowerBar') drowerBarRef: ElementRef<HTMLElement>;
  @ViewChild('dated') datedRef: ElementRef<HTMLElement>;
  mapHight = '100vh';
  startHight = 75;
  minHight;
  Coordinates: [];

  constructor(private plt: Platform, private gestureCtrl: GestureController,private apiUserServer:UserLoginService,private modalController: ModalController) {

  }

  ngOnInit() {
    this.presentModal()
  }
  ionViewWillEnter(){

    this.Coordinates = this.apiUserServer.Coordinates;
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
    const position = document.getElementById('travelBody');

    const top = position.getBoundingClientRect().top;

    if (detail.currentY > this.minHight - 40 || detail.currentY < 40) {
      return;
    }

    this.travelBodyRef.nativeElement.style.top =
      this.convertPXToVh(detail.currentY) + 'vh';
    // this.mapHight = top + 90;
  }
  onEnd(detail) {}
  convertPXToVh(px) {
    return 100 * (px / document.documentElement.clientHeight);
  }
  convertVhTopx(vh) {
    return (vh * document.documentElement.clientWidth) / 100;
  }
 
  async presentModal() {
    const modal = await this.modalController.create({
      component: PopupModalComponent,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      componentProps: { 
        header:'נסיעה טובה',
        typy:'login-success'
       
      }
    });
    modal.present()
    setTimeout(()=>{
    modal.dismiss({
      'dismissed': true
    });
  },3000 )
  
  }
}
