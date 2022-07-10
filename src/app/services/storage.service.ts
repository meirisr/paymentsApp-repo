import { Injectable } from '@angular/core';
import { GetResult, Storage } from '@capacitor/storage';


const COLOR_THEME = 'color-theme';
const USER_LANGUAGE = 'user-language';
const PHONE_NUM = 'my-phone';
const TOKEN_KEY = 'my-token';
const REFRESH_TOKEN_KEY = 'token-refresh';
const HEADER_HOTELS = 'hotels';
const USER_DETAILS = 'user-details';
const CARD_DETAILS = 'card-details';
const HOTEL_ID = 'my-hotel';
const userStorege = [
  COLOR_THEME,
  USER_LANGUAGE,
  PHONE_NUM,
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  HEADER_HOTELS,
  USER_DETAILS,
  CARD_DETAILS,
  HOTEL_ID,
];

export interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
}
@Injectable({
  providedIn: 'root',
})

export class StorageService {
  userPhoneNumber: string;
  userDetails: UserDetails;
  creditCard4Dig: string = '';

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

  public setToken = (token: string): void => {
    if (token != null && token.length > 0) this.setStorege(TOKEN_KEY, token);
  };

  public setRefreshToken = (token: string): void => {
    if (token != null && token.length > 0)
      this.setStorege(REFRESH_TOKEN_KEY, token);
  };

  public getToken = (): Promise<GetResult> => this.getStorege(TOKEN_KEY);

  public getRefreshToken = (): Promise<GetResult> =>
         this.getStorege(REFRESH_TOKEN_KEY);

  public deleteToken = (): void => this.deleteStorege();

  public setStorege(k: string, v: string): Promise<any> {
    return Storage.set({ key: k, value: v });
  }
  public async getStorege(key: string): Promise<GetResult> {
    return await Storage.get({ key: key });
  }
 public deleteStorege() {
    userStorege.forEach((storegeKey) => {
      Storage.remove({ key: storegeKey });
    });
  }
}
