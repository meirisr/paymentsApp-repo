import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NavigateHlperService {

  constructor(  private navCtrl: NavController) { }


goToMenu=()=>{
  this.navCtrl.navigateRoot(['/menu'],{replaceUrl:true})
}
goToIntro=()=>{
  this.navCtrl.navigateRoot(['/intro'],{replaceUrl:true})
}
goToLogin=()=>{
  this.navCtrl.navigateRoot(['/login'],{replaceUrl:true})
}
goToScan=()=>{
  this.navCtrl.navigateRoot(['/scan'],{replaceUrl:true})
}
goToCCDetails=()=>{
  this.navCtrl.navigateRoot(['/credit-card-details'],{replaceUrl:true})
}
goToUserProfile=()=>{
  this.navCtrl.navigateRoot(['/user-profile'],{replaceUrl:true})
}
goToUserDetails=()=>{
  this.navCtrl.navigateRoot(['/user-details'],{replaceUrl:true})
}
goToPayment=()=>{
  this.navCtrl.navigateRoot(['/payment'],{replaceUrl:true})
}
goToTravelRouteTracking=()=>{
  this.navCtrl.navigateRoot(['/travel-route-tracking'],{replaceUrl:true})
}
goToSettings=()=>{
  this.navCtrl.navigateRoot(['/settings'],{replaceUrl:true})
}
goToHistory=()=>{
  this.navCtrl.navigateRoot(['/history'],{replaceUrl:true})
}
goToHistoryPay=()=>{
  this.navCtrl.navigateRoot(['/history-pay'],{replaceUrl:true})
}


}
