import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  stationInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  Coordinates = <any>[];
  firstStation: any;
  lastStation: any;
  nearestStation: any;
  constructor(private http: HttpClient,private storageService: StorageService,) {}

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
        }
        ,
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
  ){
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
            if(!!!data.data.drive){
              this.routeInfo.next(false);
              return false;
            } 
            if(!data.data.drive.Coordinates.length){
              this.routeInfo.next(false);
              return false;
            } 
            const routeData= this.creatRouteData(data);
            this.routeInfo.next(
              routeData
             );
             this.storageService.setRouteDetails(routeData);
            
            // return data;
          })
        ).subscribe(()=>{
         
        });
    } catch (error) {
      console.log(error);
    }
  }
creatRouteData(obj){
  return { Coordinates: obj?.data?.drive?.Coordinates.map((element) => {
    return this.creatPathArray(element);
  }),
  stationArray: obj.data.drive.stationArray,
  firstStation: obj.data.drive.firstStation.stationIndex !== -1
      ? obj.data.drive.firstStation
      : null,
  lastStation: obj.data.drive.lastStation.stationIndex !== -1
      ? obj.data.drive.lastStation
      : null,
  nearestStation: obj.data.nearestStationOnRoute,
}
}
  creatPathArray(obj) {
    return { lat: obj.lat, lng: obj.lon };
  }
}
