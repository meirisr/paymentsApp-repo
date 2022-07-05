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
  ionViewDidEnter(){
    console.log("did")
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
  // this.apiUserServer.userDetails.subscribe(async (val) => {
  //   this.firstName =  val.firstName;
  //   this.lastName = val.lastName || '';
  //   this.email = val.email
  // })
  let userDetails=await (await this.utils.getStorege(USER_DETAILS)).value
    // console.log(JSON.stringify(userDetails.value));
    this.firstName = this.storageService.userDetails.firstName || '';
    this.lastName = this.storageService.userDetails.lastName || '';
    this.email = this.storageService.userDetails.email || '';
  }

 async getcardInfo() {
  let creditCardDetails=await (await this.utils.getStorege(CARD_DETAILS)).value
    this.cardNum =
      '****' +this.storageService.creditCard4Dig
      //  this.storageService.creditCard4Dig != 'undefined'
      //   ? this.storageService.creditCard4Dig
      //   : '';
  }
  goToMenu() {
    this.router.navigate(['/menu']);
  }
}
