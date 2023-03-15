import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class TravelProcessService {
  routeInfo: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  tripInfo: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  paymentTrip: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  stationInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  Coordinates = <any>[];
  firstStation: any;
  lastStation: any;
  nearestStation: any;
  routeData: any = null;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}
  public isRouteValidToOrg(data, hotelId) {
    return this.http
      .get(
        `${environment.serverUrl}/transportation/is-route-valid-to-organization`,
        {
          headers: new HttpHeaders({
            station: data?.stationId,
            organizationId: hotelId,
          }),
          params: new HttpParams().set('routeName', data?.rte),
        }
      )
      .pipe(
        map((data: any) => {
          return data.body;
        })
      )
      .subscribe(
        (data) =>{},
        (err) => console.log(err)
      );
  }
  public paymentTranportation(trip: any, hotelId: string) {
    console.log(trip);

    return this.http
      .post(
        `${environment.serverUrl}/transportation/insert-new-transportation-drive`,
        {
          routeName: '49006300',
          // trip.rte,
          fromStop: 3093,
          // +trip.nearestStation.stationID,
          toStop: 4216,
          // +trip.lastStation.stationID,
          organizationId: +hotelId,
          stationId: 36,
          // +trip.stationId
        },
        {
          headers: new HttpHeaders({ station: 'Maya-Tours' }),
        }
      )
      .pipe(
        map((data: any) => {
          return data.body;
        })
      )
      .subscribe(
        (data) => {
          this.paymentTrip.next(this.routeData); //true
          this.storageService.setRouteDetails(this.routeData);
        
        },
        (err) => {
          this.paymentTrip.next(this.routeData); //none
          console.log(err);
        }
      );
  }
  public newTransportationDrive(
    trip: { userLocation: any; busNomber: string },
    hotelId: string
  ): Observable<any> {
  

    return this.http.post(
      `${environment.serverUrl}/transportation/insert-new-transportation-drive-without-route`,
      {
        vehicle:"163",
        //  +trip.busNomber,
        organizationId: +hotelId,
        // organizationId: "41",
        // stationId: 59562,
        stationId: 32,
        coordinates: trip.userLocation,
        // coordinates:{latitude: 31.79441, longitude: 35.1875368}
      }
      // {
      //   headers: new HttpHeaders({ station: 'Maya-Tours' }),
      // }
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
            this.routeData = this.creatRouteData(data);
            this.routeInfo.next(this.routeData);

            return this.routeData;
          })
        );
    } catch (error) {
      console.log(error);
    }
  }
  creatRouteData(obj) {

    return {
      Coordinates: obj?.data?.drive?.Coordinates.map((element) => {
        return this.creatPathArray(element);
      }),
      stationId: obj.data.drive.operatorId,
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
      rte: obj.data.drive.RTE,
    };
  }
  creatPathArray(obj) {
    return { lat: obj.lat, lng: obj.lon };
  }
}
