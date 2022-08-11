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

  public setToken = (token: string): void => {
    if (token != null && token.length > 0) this.setStorege(TOKEN_KEY, token);
  };

  public setRefreshToken = (token: string): void => {
    if (token != null && token.length > 0)
      this.setStorege(REFRESH_TOKEN_KEY, token);
  };
  public setUserDetails = (details: UserDetails): void => {
    this.setStorege(USER_DETAILS, JSON.stringify(details));
  };
  public setCreditCard4Dig = (details: string): void => {
    this.setStorege(CARD_DETAILS, details);
  };
  public setHotelId = (details: string): void => {
    this.setStorege(HOTEL_ID, details);
  };

  public getToken = (): Promise<GetResult> => this.getStorege(TOKEN_KEY);

  public getRefreshToken = (): Promise<GetResult> =>
    this.getStorege(REFRESH_TOKEN_KEY);

  public getUserDetails = (): Promise<GetResult> =>
    this.getStorege(USER_DETAILS);
  public getCreditCard4Dig = (): Promise<GetResult> =>
    this.getStorege(CARD_DETAILS);
  public getHotelId = (): Promise<GetResult> => this.getStorege(HOTEL_ID);

  public deleteToken = (): void => this.deleteAllStorege();

  public setStorege(k: string, v: string): Promise<any> {
    return Storage.set({ key: k, value: v });
  }
  public async getStorege(key: string): Promise<GetResult> {
    return await Storage.get({ key: key });
  }

  public deleteStorege(storageKey) {
    Storage.remove({ key: storageKey });
  }
  public deleteAllStorege() {
    userStorege.forEach((storegeKey) => {
      Storage.remove({ key: storegeKey });
    });
  }
}
