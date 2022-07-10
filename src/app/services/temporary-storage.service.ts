import { Injectable } from '@angular/core';

export interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class TemporaryStorageService {
  constructor() {}
  private userPhoneNumber: string | null;
  private userDetails: UserDetails | null = null;
  private creditCard4Dig: string | null = '';

  public getUserPhoneNumber = (): string => {
    return this.userPhoneNumber;
  };
  public getUserDetails = (): UserDetails => {
    return this.userDetails;
  };
  public getCreditCard4Dig = (): string => {
    return this.creditCard4Dig;
  };

  public setUserPhoneNumber(phone: string) {
    this.userPhoneNumber = phone;
  }
  public setUserDetails(details: UserDetails) {
    this.userDetails = details;
  }
  public setCreditCard4Dig(details: string) {
    this.creditCard4Dig = details;
  }
}
