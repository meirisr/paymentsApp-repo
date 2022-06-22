import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/app/services/api/user-login.service';

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

  constructor(private apiUserServer: UserLoginService,private router: Router) {}

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
    this.apiUserServer.userDetails.subscribe(
      async (rs) => {
        this.firstName = this.apiUserServer.userDetails.value.firstName || '';
        this.lastName = this.apiUserServer.userDetails.value.lastName || '';
        this.email = this.apiUserServer.userDetails.value.email || '';
      },
      async (rs) => {}
    );
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
}
