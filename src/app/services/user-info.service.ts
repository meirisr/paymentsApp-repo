import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService, UserDetails } from './storage.service';
import { UtilsService } from './utils/utils.service';
@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  debtCheck$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  isUserHasDetails: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  isCardHasDetails: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  userDetails = new BehaviorSubject({ firstName: '', lastName: '', email: '' });
  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private utils: UtilsService
  ) {}

  public getUserDetails():void{
     this.http.get(`${environment.serverUrl}/user/get-user-details`).pipe(
      map((data: any) => {
        if (data.body.email && data.body.firstName && data.body.lastName) {
          this.storageService.setUserDetails(data.body);
          this.isUserHasDetails.next(true);
        } else {
          this.isUserHasDetails.next(false);
        }
      })
    ).subscribe(
      async() => {
        this.isUserHasDetails.subscribe((v) =>
          console.log('isUserHasDetails:', v)
        );
      },
      async (err) => {
        console.log(err);
        this.onHttpErorr(err, '');
      }
    );
  }
  public getCreditCardInfo(){
     this.http
      .get(
        `${environment.serverUrl}/credit-card-payment/get-last-digits-of-credit-card`
      )
      .pipe(
        map((data: any) => {
          if (data.body != null && data.body.length > 0) {
            this.storageService.setCreditCard4Dig(data.body);
            this.isCardHasDetails.next(true);
          } else {
            this.isCardHasDetails.next(false);
          }
        })
      ).subscribe(
        async() => {
          this.isCardHasDetails.subscribe((v) =>
            console.log('isCardHasDetails:', v)
          );
        },
        async (err) => {
          console.log(err);
          this.onHttpErorr(err, '');
        }
      );
  }
  public getUserHistory(): Observable<any> {
    var date = new Date();
    // var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return this.http
      .post(
        `${environment.serverUrl}/transportation/get-history-drives-per-user`,
        {
          before: Date.UTC(date.getFullYear(),date.getMonth()),
          after: Date.now(),
        },
        {
          headers: new HttpHeaders({ station: 'hotels' }),
        }
      )
      .pipe(
        map((data: any) => {
          return data.body;
        })
      );
  }
  public getUnpaidTrips() {
    return this.http
      .get(`${environment.serverUrl}/transportation/get-unpaid-drives-per-user` ,{
        headers: new HttpHeaders({ station: 'hotels' }),
      })
      .pipe(
        map((data: any) => {
          console.log(data)
          this.debtCheck$.next(false);
          return data.body;
        })
      )
      .subscribe(
        (data) => {
          console.log(data)
          this.debtCheck$.next(false)
        } ,
        (err) => {
          this.debtCheck$.next(false)
          console.log("err")
        }
      );
  }
  public tripPayment(): Observable<any> {
   
    return this.http
      .post(
        `${environment.serverUrl}/credit-card-payment/card-transportation`,
        {
            driveId:'',
            creditCardNumber:'',
            verificationNumber:'',
            holderId:'',
            validUntilMonth:0,
            validUntilYear:0,
            paymentAmount:0,
        },
        {
          headers: new HttpHeaders({ station: 'hotels' }),
        }
      )
      .pipe(
        map((data: any) => {
          return data.body;
        })
      );
  }

  public async updateUserInfo(credentials: UserDetails): Promise<void> {
    this.http
      .post(
        `${environment.serverUrl}/user/update-details`,
        {
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          email: credentials.email,
        },
        {
          headers: new HttpHeaders({ station: 'hotels' }),
        }
      )
      .pipe()
      .subscribe(
        async () => {
          this.storageService.setUserDetails(credentials);
          this.userDetails.next(credentials);
          // this.handleButtonClick();
        },
        async (res) => {
          this.onHttpErorr(res, '');
        }
      );
  }

  public async updateCreditCard(credentials: {
    cardNum: string;
    csvNum: string;
    date: string;
    userId: string;
  }): Promise<void> {
    this.http
      .post(
        `${environment.serverUrl}/credit-card-payment/register-wallet`,
        {
          creditCardNumber: credentials.cardNum,
          verificationNumber: credentials.csvNum,
          holderId: credentials.userId,
          validUntilMonth: credentials.date.split('/')[0],
          validUntilYear: credentials.date.split('/')[1],
        },
        {
          headers: new HttpHeaders({ station: 'hotels' }),
        }
      )
      .subscribe(
        async () => {
          this.getCreditCardInfo();
        },
        async (res) => {
          console.log(res);
          this.onHttpErorr(res, '');
        }
      );
  }

  public async onHttpErorr(e, header) {
    this.utils.showalert(e, header);
  }
}
