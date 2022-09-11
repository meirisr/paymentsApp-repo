import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TravelProcessService {
  routeInfo: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  Coordinates = <any>[];
  firstStation: any;
  lastStation: any;
  nearestStation: any;
  constructor(private http: HttpClient) {}

  public paymentTranportation(): Observable<any> {
    return this.http
      .post(
        `${environment.serverUrl}/credit-card-payment/wallet-transportation`,
        {
          paymentAmount: 10,
          //  currency = Currency.NIS; //לא צריך לשלוח את הפרמטר הזה כשמדובר בשקלים
          route: '',
          trip: 'test',
          fromStop: 'first',
          toStop: 'to',
        },
        {
          headers: new HttpHeaders({ station: 'hotels' }),
        }
      )
      .pipe(
        map((data: any) => {
          console.log( data.body)
          return data.body;
        })
      );
  }

  public getTravelDetails(
    location: { latitude: number; longitude: number },
    VehicleNum: number
  ): Observable<any> {
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
            // console.log(data);
            if (data.status != 'Success') {
              this.routeInfo.next(false);
              return false;
            }
            if(!!!data.data.drive){
              this.routeInfo.next(false);
              return false;
            } 
            if(!data.data.drive.Coordinates.length){
              this.routeInfo.next(false);
              return false;
            } 
            this.routeInfo.next({
              Coordinates: data?.data?.drive?.Coordinates.map((element) => {
                return this.creatPathArray(element);
              }),
              stationArray: data.data.drive.stationArray,
              firstStation:
                data.data.drive.firstStation.stationIndex !== -1
                  ? data.data.drive.firstStation
                  : null,
              lastStation:
                data.data.drive.lastStation.stationIndex !== -1
                  ? data.data.drive.lastStation
                  : null,
              nearestStation: data.data.nearestStationOnRoute,
            });
            return data;
          })
        );
    } catch (error) {
      console.log(error);
    }
  }
  creatPathArray(obj) {
    return { lat: obj.lat, lng: obj.lon };
  }
}
