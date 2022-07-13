import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TravelProcessService {
  Coordinates = <any>[];
  firstStation: any;
  lastStation: any;
  nearestStation:any;
  constructor(private http: HttpClient,) { }


  public  paymentTranportation():Observable<any> {
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
      ).pipe(map((data: any)=>{
        return data.body
      }))
    
  }

  public getTravel(location:{latitude:number,longitude:number},VehicleNum:number): Observable<any> {
    try {
      return this.http
        .post(
          `http://siri.motrealtime.co.il:8090/TGServer/webresources/App/GetDetailsByVehicle`,

          {
          
            Vehicle:VehicleNum ,
            location:location,
            getRoute:true,
            getNearestStationOnRoute:true

          }
        )
        .pipe(
          map((data: any) => {
            console.log(data.data)
            if (!data.data.statusCode) return;
            this.firstStation=data.data.drive.firstStation
            this.lastStation=data.data.drive.lastStation
            this.nearestStation=data.data.nearestStationOnRoute
            data.data.drive.Coordinates.forEach((element) => {
            this.Coordinates.push(this.creatPathArray(element));
            });
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
