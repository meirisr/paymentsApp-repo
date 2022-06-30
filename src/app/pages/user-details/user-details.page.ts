import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { from } from 'rxjs';
import { UserLoginService } from 'src/app/services/api/user-login.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
})
export class UserDetailsPage implements OnInit {
  public userDetails: FormGroup;
  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private apiUserServer: UserLoginService,
    private  storageService: StorageService,
    private router:Router
  ) {}
  get firstName() {
    return this.userDetails.get('firstName');
  }
  get lastName() {
    return this.userDetails.get('lastName');
  }
  get email() {
    return this.userDetails.get('email');
  }
  ngOnInit() {
    this.userDetails = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
    });
    this.getuserInfo();
  }

  async updateUserInfo() {
    from(this.apiUserServer.updateUserInfo(this.userDetails.value)).subscribe(
      async (res) => {
        this.getuserInfo();
      },
      async (res) => {
        const alert = await this.alertController.create({
          header: 'Update failed',
          message: res.error.error.errorMessage['en-us'],
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }
  async getuserInfo() {
    const loading = await this.loadingController.create();
    await loading.present();
        await loading.dismiss();
        this.userDetails.setValue({
          firstName: this.storageService.userDetails.firstName ,
          lastName: this.storageService.userDetails.lastName,
          email: this.storageService.userDetails.email ,
        });
        // this.goToUserProfile()
}
goToUserProfile(){
    this.router.navigate(['/user-profile']);
}
goToMenu(){
    this.router.navigate(['/menu']);
}
}
