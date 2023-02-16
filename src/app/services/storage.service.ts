import { Injectable } from '@angular/core';
import { GetResult, Storage } from '@capacitor/storage';

export const userStoregeObj = {
  COLOR_THEME: 'color-theme',
  USER_LANGUAGE: 'user-language',
  PHONE_NUM: 'my-phone',
  TOKEN_KEY: 'my-token',
  REFRESH_TOKEN_KEY: 'token-refresh',
  HEADER_HOTELS: 'Maya-Tours',
  USER_DETAILS: 'user-details',
  ROUTE_DETAILS: 'route-details',
  CARD_DETAILS: 'card-details',
  HOTEL_ID: 'my-hotel-id',
  HOTEL_NAME: 'my-hotel-name',
};

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

  setUserPhoneNumber(phone: string): void {
    this.userPhoneNumber = phone;
  }

  public setToken = (token: string): void => {
    if (token != null && token.length > 0)
      this.setStorege(userStoregeObj.TOKEN_KEY, token);
  };

  public setRefreshToken = (token: string): void => {
    if (token != null && token.length > 0)
      this.setStorege(userStoregeObj.REFRESH_TOKEN_KEY, token);
  };
  public setUserDetails = (details: UserDetails): void => {
    this.setStorege(userStoregeObj.USER_DETAILS, JSON.stringify(details));
  };
  public setCreditCard4Dig = (details: string): void => {
    this.setStorege(userStoregeObj.CARD_DETAILS, details);
  };
  public setHotelId = (details: string): void => {
    this.setStorege(userStoregeObj.HOTEL_ID, details);
  };
  public setHotelName = (details: string): void => {
    this.setStorege(userStoregeObj.HOTEL_NAME, details);
  };
  public setRouteDetails = (details): void => {
    this.setStorege(userStoregeObj.ROUTE_DETAILS, JSON.stringify(details));
  };

  public getToken = (): Promise<GetResult> => {
    return this.getStorege(userStoregeObj.TOKEN_KEY);
  };

  public getRefreshToken = (): Promise<GetResult> =>
    this.getStorege(userStoregeObj.REFRESH_TOKEN_KEY);

  public getUserDetails = (): Promise<GetResult> =>
    this.getStorege(userStoregeObj.USER_DETAILS);
  public getRuteDetails = (): Promise<GetResult> =>
    this.getStorege(userStoregeObj.ROUTE_DETAILS);
  public getCreditCard4Dig = (): Promise<GetResult> =>
    this.getStorege(userStoregeObj.CARD_DETAILS);
  public getHotelId = (): Promise<GetResult> =>
    this.getStorege(userStoregeObj.HOTEL_ID);
  public getHotelName = (): Promise<GetResult> =>
    this.getStorege(userStoregeObj.HOTEL_NAME);
  public deleteToken = (): void => this.deleteAllStorege();
  public deleteRouteDetails = (): void => {
    Storage.remove({ key: userStoregeObj.ROUTE_DETAILS });
  };
  public deleteHotelId = (): void => {
    Storage.remove({ key: userStoregeObj.HOTEL_ID });
  };
  public deleteHotelName = (): void => {
    Storage.remove({ key: userStoregeObj.HOTEL_NAME });
  };

  public setStorege(k: string, v: string): Promise<any> {
    return Storage.set({ key: k, value: v });
  }
  public async getStorege(key: string): Promise<GetResult> {
    return await Storage.get({ key: key });
  }

  public deleteStorege(storageKey: string) {
    Storage.remove({ key: storageKey });
  }
  public deleteAllStorege(): void {
    Object.values(userStoregeObj).forEach((storegeKey: string) => {
      Storage.remove({ key: storegeKey });
    });
  }
}
