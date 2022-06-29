import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  userPhoneNumber: string;
  userDitails={};
  constructor() {}

  setUserPhoneNumber(phone: string) {
    this.userPhoneNumber = phone;
  }
}
