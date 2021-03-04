import { Logger } from '@nestjs/common';
import { addMinutes } from 'date-fns';
import { timer } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';

import {
  MarketService,
  OperationType,
  OrderType,
} from '../../market/market.service';
import { PromiseOrValue } from '../../util.types';
import { Agent } from '../models/agent.model';
import { Brain } from '../models/brain.model';

/**
 * A Random Test-Brain, which creates orders as it pleases
 */
export class SzenarioBrain extends Brain {
  private alive = false;
  private agent: Readonly<Agent>;
  private marketService: Readonly<MarketService>;
  private logger = new Logger();

  private startDate = new Date(2019, 9, 22, 4, 51); //TODO: Das ist szenario 4
  private currentTime = timer(0, 1000);
  private szenarioData: any;

  onAgentInit(agent: Readonly<Agent>): PromiseOrValue<void> {
    this.agent = agent;
  }

  onMarketInit(marketService: Readonly<MarketService>): PromiseOrValue<void> {
    this.marketService = marketService;
  }

  onData(szenarioData: any[]) {
    this.szenarioData = szenarioData;
  }

  animate(): PromiseOrValue<void> {
    this.alive = true;
    this.currentTime
      .pipe(
        takeWhile((_) => this.alive),
        map((time) => addMinutes(this.startDate, time)),
      )
      .subscribe(async (time) => {
        console.log(this.szenarioData.length, time);
        const datapoint = this.szenarioData.find(
          (d) => new Date(d.time).getTime() === time.getTime(),
        );
        if (!datapoint) return;

        //delta sind prozentpunkte
        const currentMarket = await this.marketService.onInformationAvailable
          .pipe(take(1))
          .toPromise();

        const target = currentMarket * (1 + datapoint.delta);

        const diff = target - currentMarket;
        const volume = datapoint.volume;
        console.log(currentMarket, target);
        //SELL Order
        this.marketService.placeOrder({
          stockCount: volume,
          aktenId: 'moon',
          price: target,
          type: OrderType.MARKET_ORDER,
          operation: OperationType.SELL,
        });

        //Buy order
        this.marketService.placeOrder({
          stockCount: volume,
          aktenId: 'moon',
          price: target,
          type: OrderType.MARKET_ORDER,
          operation: OperationType.BUY,
        });
      });
  }

  kill(): PromiseOrValue<void> {
    this.alive = false;
  }

  isAlive(): PromiseOrValue<boolean> {
    return this.alive;
  }
}
