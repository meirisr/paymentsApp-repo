import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  userDetails:any;
  firstName: string;
  lastName: string;
  email: string;
  cardNum: string;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private nav: NavController
  ) {}

  
  ionViewDidEnter() {
    this.getuserInfo();
    this.getcardInfo();
  }
  ngOnInit() {
  
  }

  goToUserDetails() {
    this.router.navigate(['/user-details']);
  }
  cardDetails() {
    this.router.navigate(['/credit-card-details']);
  }
  async getuserInfo() {
     this.userDetails = JSON.parse(
      (await this.storageService.getUserDetails()).value
    );
    this.firstName =
      // this.storageService?.userDetails?.firstName ||
      this.userDetails?.firstName ||
      '';
    this.lastName =
      // this.storageService?.userDetails?.lastName || 
       this.userDetails?.lastName || '';
    this.email =
      // this.storageService?.userDetails?.email ||  
      this.userDetails?.email || '';
  }

  async getcardInfo() {
    let creditCardDetails = await (
      await this.storageService.getCreditCard4Dig()
    ).value;
    this.cardNum = creditCardDetails != null ? '****' + creditCardDetails : '';
  }
  goToMenu() {
    this.router.navigate(['/menu']);
  }
}
