import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { filter, first, map, retryWhen, concatMap, delayWhen  } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TranslationService {

  constructor(private translateService: TranslateService) {
    TranslationService.translateServiceSubject.next(translateService);
  }

  private static translateServiceSubject: BehaviorSubject<TranslateService | null> = new BehaviorSubject<TranslateService | null>(null);

  // this method can be used from non-angular related files
  public static get(key: string | Array<string>, interpolateParams?: any): Promise<string | any> {
    return TranslationService.getReadyTranslationService().pipe(concatMap(_translateService => _translateService.get(key, interpolateParams)), first()).toPromise()
  }

  private static getReadyTranslationService(): Observable<TranslateService> {
    return TranslationService.translateServiceSubject.pipe(
      filter(_translateService => _translateService != null),
      map(_translateService => _translateService as TranslateService),
      map(_translateService => {
        if (TranslationService.isValidArray(_translateService.getLangs())) {
          return _translateService;
        } else {
          throw new Error();
        }
      }),
      retryWhen(erroredStream => erroredStream.pipe(delayWhen(() => timer(100)))
      )
    );
  }

  public getNow(key: string | Array<string>, interpolateParams?: any): string | any {
    return this.translateService.instant(key, interpolateParams);
  }

  public get(key: string | Array<string>, interpolateParams?: any): Observable<string | any> {
    return TranslationService.getReadyTranslationService()
      .pipe(concatMap(_translateService => _translateService.get(key, interpolateParams)), first());
  }

  public getPromise(key: string | Array<string>, interpolateParams?: any): Promise<string | any> {
    return TranslationService.getReadyTranslationService()
    .pipe(concatMap(_translateService => _translateService.get(key, interpolateParams)), first()).toPromise();
  }

  public setDefaultLang(defaultLanguage: string): void {
    this.translateService.setDefaultLang(defaultLanguage);
  }

  public getDefaultLang(): string {
    return this.translateService.getDefaultLang();
  }

  private static isValidArray(value: any): value is any[] {
    if(value == null || !Array.isArray(value)) {
      return false;
    }
    return value.length > 0;
  }

}