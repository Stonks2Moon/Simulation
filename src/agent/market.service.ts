import { Injectable } from '@nestjs/common';
import { ReplaySubject, timer } from 'rxjs';

@Injectable()
export class MarketService {
  private _currentMarketInformation = new ReplaySubject<void>();

  constructor(){
    timer(100).subscribe(_ => {
      this._currentMarketInformation.next()
    })//TEMP
  }

  get onInformationAvailable() {
    return this._currentMarketInformation.asObservable();
  }
}
