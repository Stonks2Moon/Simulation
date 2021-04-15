import {
  BeforeApplicationShutdown,
  HttpService,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { of, ReplaySubject, Subscription, timer } from 'rxjs';
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
  price?: number;
  operation: OperationType;
  subsequentOrders?: PlaceOrderInput[];
  token: string;
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
  private stock: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly baselineService: BaselineService,
    private readonly httpService: HttpService,
  ) {}

  beforeApplicationShutdown() {
    this.refreshSubscription?.unsubscribe();
  }

  get onInformationAvailable() {
    return this._currentMarketInformation.asObservable();
  }

  private async refreshCurrentStockMarket() {
    const response = await this.httpService
      .get('https://boerse.moonstonks.space/share/price/' + this.stock)
      .toPromise();
    this._currentMarketInformation.next(+response.data);
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

  public async placeOrder(order: PlaceOrderInput): Promise<void> {
    const key = createHash('md5').update(JSON.stringify(order)).digest('hex');

    if (order.subsequentOrders?.length) {
      this.orderQueue.set(key, order);
    }
    const body: any = {
      shareId: order.aktenId,
      amount: order.stockCount,
      onPlace: '_',
      onMatch: '_',
      onComplete: '_',
      onDelete: '_',
      type: order.operation,
    };
    if (order.price) {
      body.limit = +order.price.toFixed(2);
    }

    await axios.post('https://boerse.moonstonks.space/order', body, {
      headers: {
        Authorization: order.token,
      },
    });
  }

  setWatch(interval: number, stock: string) {
    this.stock = stock;
    if (this.refreshSubscription) this.refreshSubscription.unsubscribe();
    this.refreshSubscription = timer(0, interval).subscribe(() =>
      this.refreshCurrentStockMarket(),
    );
  }
}
