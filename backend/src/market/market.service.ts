import { BeforeApplicationShutdown, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReplaySubject, Subscription, timer } from 'rxjs';
import { createHash } from 'crypto';
import { BaselineService } from '../baseline/baseline.service';
import axios from 'axios';

export enum OperationType {
  BUY = 'buy',
  SELL = 'sell',
}

export interface PlaceOrderInput {
  aktenId: string;
  stockCount: number;
  price: number | 'market';
  operation: OperationType;
  subsequentOrders?: PlaceOrderInput[];
}

/*
  Anforderungen MarketService:
    * Sobald neue Informationen (Kurse) verfügbar sind, werden diese als Observable veröffentlicht
    * Kurse können aus Börsen-API via WebSockets erhalten werden
    * MarketService muss die Möglichkeit besitzen komplexere Orderketten zu realisieren
      * Dazu zählt das "einqueuen" beliebiger Orderketten
      * Ausführen, nachdem bestimmte Transaktionen abgeschlossen sind (nicht nur im Orderbuch!)
*/
@Injectable()
export class MarketService implements BeforeApplicationShutdown {
  private _currentMarketInformation = new ReplaySubject<number>(1); //TODO: Buffer größe
  public orderQueue = new Map<string, PlaceOrderInput>();
  private refreshSubscription: Subscription;

  constructor(
    private readonly configService: ConfigService,
    private readonly baselineService: BaselineService,
  ) {
    this.refreshSubscription = timer(0, 1000).subscribe(() =>
      this.refreshCurrentStockMarket(),
    );
  }

  beforeApplicationShutdown() {
    this.refreshSubscription.unsubscribe();
  }

  get onInformationAvailable() {
    return this._currentMarketInformation.asObservable();
  }

  private course = 100; //COURSE
  private async refreshCurrentStockMarket() {
    const value = this.baselineService.generateNextPrice();
    if (value) {
      this.course += value;
    }
    this._currentMarketInformation.next(this.course);
  }

  public processCallback(orderHash: string) {
    if (!this.orderQueue.has(orderHash)) {
      throw new Error('No order for given hash was enqueued');
    }

    const order = this.orderQueue.get(orderHash);

    if (!order.subsequentOrders?.length) {
      return;
    }

    for (const subOrder of order.subsequentOrders) {
      this.placeOrder(subOrder);
    }

    this.orderQueue.delete(orderHash);
  }

  private createCallbackURL(orderHash: string): string {
    // TODO: richtige URL
    return `${this.configService.get('BASE_URL')}/whatever/${orderHash}`;
  }

  /**
   * 1. Überprüfen, ob die Order eingequeued werden muss oder nicht
   * 1.1 JA -- es wird ein md5 Hash generiert, der als Key für die `orderQueue`-Map genommen wird
   * 1.2 NEIN --  es wird eine CallbackURL erstellt, die bei der Kommunikation mit der Börse verwendet wird
   */
  public async placeOrder<T = any>(order: PlaceOrderInput): Promise<T> {
    const key = createHash('md5').update(JSON.stringify(order)).digest('hex');

    if (order.subsequentOrders?.length) {
      this.orderQueue.set(key, order);
    }
    const _callcackURL = this.createCallbackURL(key);
    console.log('presend', order)
    const a = await axios.post(
      'https://boerse.moonstonks.space/order',
      {
        shareId: order.aktenId,
        amount: order.stockCount,
        onPlace: 'abc',
        onMatch: 'abc',
        onComplete: 'abc',
        onDelete: 'abc',
        type: order.operation,
        // limit: order.price,
        // stop: 0,
      },
      {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNDc3Mzc5YzE4ZTM1MTNmNGEyZTRjNiIsImRpc3BsYXlOYW1lIjoiU2ltKHApdWxhdGlvbnMgR3J1cHBlIiwidHlwZSI6InNpbXVsYXRpb24iLCJpYXQiOjE2MTU0NTg0NDF9.44A1cJvmf0ZUUIMwNFj8hFZFhbIqDP6_gbspXzrOoyk',
        },
      },
    );

    console.log(a.data);

    return;
  }
}
