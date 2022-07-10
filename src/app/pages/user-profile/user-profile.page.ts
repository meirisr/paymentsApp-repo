import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/app/services/api/user-login.service';

import { StorageService } from 'src/app/services/storage.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
const USER_DETAILS = 'user-details';
const CARD_DETAILS = 'card-details';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  firstName: string;
  lastName: string;
  email: string;
  cardNum: string;

  constructor(private router: Router, private storageService: StorageService, private utils:UtilsService ,private apiUserServer:UserLoginService) {

  }
  // ionViewWillEnter(){
  //   console.log("Will")
  //   this.getuserInfo();
  //   this.getcardInfo();
  // }
  ionViewDidEnter(){
    this.getuserInfo();
    this.getcardInfo();
  }
  ngOnInit() {

  }
  ngAfterViewInit(): void {
    // this.getuserInfo();
    // console.log("did")
    // this.getuserInfo();
    // this.getcardInfo();

  }
  userDetails() {
    this.router.navigate(['/user-details']);
  }
  cardDetails() {
    this.router.navigate(['/credit-card-details']);
  }
 async getuserInfo() {
  
  let userDetails=JSON.parse(await (await (await this.utils.getStorege(USER_DETAILS)).value))
  
    // console.log(JSON.stringify(userDetails.value));
    this.firstName = this.storageService?.userDetails?.firstName || userDetails?.firstName||'';
    this.lastName = this.storageService?.userDetails?.lastName || userDetails?.lastName||'';
    this.email = this.storageService?.userDetails?.email || userDetails?.email||'';
  }

 async getcardInfo() {
  let creditCardDetails=await (await this.utils.getStorege(CARD_DETAILS)).value
    this.cardNum =
      ('****' +this.storageService?.creditCard4Dig)||('****' +creditCardDetails)||''
      //  this.storageService.creditCard4Dig != 'undefined'
      //   ? '****'+this.storageService.creditCard4Dig
      //   : '';
  }
  goToMenu() {
    this.router.navigate(['/menu']);
  }
}
