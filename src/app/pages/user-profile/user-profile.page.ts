import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/app/services/api/user-login.service';
import { StorageService } from 'src/app/services/storage.service';

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

  constructor(private apiUserServer: UserLoginService,private router: Router,private storageService: StorageService) {}

  ngOnInit() {
    this.getuserInfo();
    this.getcardInfo();
  }
  userDetails() {
    this.router.navigate(['/user-details']);
  }
  cardDetails() {
    this.router.navigate(['/credit-card-details']);
  }
  getuserInfo() {
        console.log(this.storageService.userDetails)
        this.firstName =  this.storageService.userDetails.firstName || '';
        this.lastName =  this.storageService.userDetails.lastName || '';
        this.email = this.storageService.userDetails.email || '';
      }
  
  getcardInfo() {
    this.apiUserServer. getCreditCardInfo().then(()=>{
      this.apiUserServer.creditCardDetails.subscribe(
        async (rs) => {
          this.cardNum = '****'+this.apiUserServer.creditCardDetails.value || '';
        },
        async (rs) => {}
      );
    });

  }
  goToMenu(){
    this.router.navigate(['/menu']);
}
}
