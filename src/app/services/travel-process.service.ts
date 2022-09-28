import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService, userStoregeObj } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class TravelProcessService {
  routeInfo: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  stationInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  Coordinates = <any>[];
  firstStation: any;
  lastStation: any;
  nearestStation: any;
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}
  public isRouteValidToOrg(data){
    return this.http
      .get(
        `${environment.serverUrl}/transportation/is-route-valid-to-organization`,
        {
          headers: new HttpHeaders({ station: userStoregeObj.HEADER_HOTELS }),
          params: new HttpParams().set('routeName', "credentials.phone"),
        }
      )
      .pipe(
        map((data: any) => {
        
          return data.body;
        })
      ) 
      .subscribe(
        (data) => console.log(data),
        (err) => console.log(err)
      );
  
}
  public paymentTranportation(trip, hotelId: string) {
    return this.http
      .post(
        `${environment.serverUrl}/transportation/insert-new-transportation-drive`,
        {
          routeName: 'dfsdfsd',
          fromStop: trip.nearestStation,
          toStop: trip.lastStation,
          organizationId: +userStoregeObj.HEADER_HOTELS,
          stationId: +trip.stationId,
        },
        {
          headers: new HttpHeaders({ station: 'hotels' }),
        }
      )
      .pipe(
        map((data: any) => {
          return data.body;
        })
      )
      .subscribe(
        (data) => console.log(data),
        (err) => console.log(err)
      );
  }

  public getTravelDetails(
    location: { latitude: number; longitude: number },
    VehicleNum: number
  ) {
    try {
      return this.http
        .post(
          `http://siri.motrealtime.co.il:8090/TGServer/webresources/App/GetDetailsByVehicle`,

          {
            Vehicle: VehicleNum,
            location: location,
            getRoute: true,
            getNearestStationOnRoute: true,
          }
        )
        .pipe(
          map((data: any) => {
            console.log(data);
            if (data.status != 'Success') {
              this.routeInfo.next(false);
              return false;
            }
            if (!!!data.data.drive) {
              this.routeInfo.next(false);
              return false;
            }
            if (!data.data.drive.Coordinates.length) {
              this.routeInfo.next(false);
              return false;
            }
            const routeData = this.creatRouteData(data);
            this.routeInfo.next(routeData);
            this.storageService.setRouteDetails(routeData);

            return routeData;
          })
        );
    } catch (error) {
      console.log(error);
    }
  }
  creatRouteData(obj) {
    console.log(obj);
    return {
      Coordinates: obj?.data?.drive?.Coordinates.map((element) => {
        return this.creatPathArray(element);
      }),
      stationId: obj.data.drive.operatorid,
      stationArray: obj.data.drive.stationArray,
      firstStation:
        obj.data.drive.firstStation.stationIndex !== -1
          ? obj.data.drive.firstStation
          : null,
      lastStation:
        obj.data.drive.lastStation.stationIndex !== -1
          ? obj.data.drive.lastStation
          : null,
      nearestStation: obj.data.nearestStationOnRoute,
    };
  }
  creatPathArray(obj) {
    return { lat: obj.lat, lng: obj.lon };
  }
}
