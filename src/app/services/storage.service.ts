import { Injectable } from '@angular/core';
 interface UserDetails {
  firstName :string,
  lastName: string,
  email :string
 }
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  userPhoneNumber: string;
  userDetails :UserDetails;
  constructor() {}

  setUserPhoneNumber(phone: string) {
    this.userPhoneNumber = phone;
  }
  setUserDetails(details: UserDetails) {
    this.userDetails = details;
  }
}
