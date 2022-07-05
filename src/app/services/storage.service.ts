import { Injectable } from '@angular/core';
 export interface UserDetails {
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
  creditCard4Dig: string
 

  setUserPhoneNumber(phone: string) {
    this.userPhoneNumber = phone;
  }
  setUserDetails(details: UserDetails) {
   console.log(details);
    this.userDetails = details;
  }
  setCreditCard4Dig(details: string) {
    this.creditCard4Dig = details;
    
  }
}
