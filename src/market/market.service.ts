import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReplaySubject, timer } from 'rxjs';
import { createHash } from 'crypto';
import { BaselineService } from '../baseline/baseline.service';

export enum OrderType {
  SELL,
  BUY,
}

export interface PlaceOrderInput {
  type: OrderType;
  stockCount: number;
  price: number | 'market';
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
export class MarketService {
  private _currentMarketInformation = new ReplaySubject<number>();
  public orderQueue = new Map<string, PlaceOrderInput>();

  constructor(
    private readonly configService: ConfigService,
    private readonly baselineService: BaselineService,
  ) {
    timer(0, 1000).subscribe(() => this.refreshCurrentStockMarket());
  }

  get onInformationAvailable() {
    return this._currentMarketInformation.asObservable();
  }

  private async refreshCurrentStockMarket() {
    const value = this.baselineService.generateNextPrice();
    this._currentMarketInformation.next(value);
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
    return;
  }
}
