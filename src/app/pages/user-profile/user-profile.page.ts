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
  firstName: string;
  lastName: string;
  email: string;
  cardNum: string;

  constructor(private router: Router, private storageService: StorageService,private nav: NavController) {}

  ionViewillEnter() {
   
  }
  ionViewDidEnter() {
    this.getuserInfo();
    this.getcardInfo();
  }
  ngOnInit() {}
  ngAfterViewInit(): void {}
  userDetails() {
    this.nav.navigateForward('/user-details', { animationDirection: 'forward', animated: true })
    // this.router.navigate(['/user-details']);
  }
  cardDetails() {
    this.nav.navigateForward('/credit-card-details', { animationDirection: 'forward', animated: true })
    // this.router.navigate(['/credit-card-details']);
  }
  async getuserInfo() {
    let userDetails = JSON.parse(
       (
        await this.storageService.getUserDetails()
      ).value
    );
    this.firstName =
      this.storageService?.userDetails?.firstName ||
      userDetails?.firstName ||
      '';
    this.lastName =
      this.storageService?.userDetails?.lastName || userDetails?.lastName || '';
    this.email =
      this.storageService?.userDetails?.email || userDetails?.email || '';
  }

  async getcardInfo() {
    let creditCardDetails = await (
      await this.storageService.getCreditCard4Dig()
    ).value;
    this.cardNum = creditCardDetails != null ? '****' + creditCardDetails : '';
  }
  goToMenu() {
    this.nav.navigateBack('/menu',{ replaceUrl: true  });
  }
}
