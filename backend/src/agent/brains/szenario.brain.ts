import { Logger } from '@nestjs/common';
import { addMinutes } from 'date-fns';
import { timer } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';

import { MarketService, OperationType } from '../../market/market.service';
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

  private startDate = new Date(2020, 9, 26, 4, 0); //TODO: Das ist szenario 4
  private currentTime = timer(0, 500);
  private szenarioData: any;

  private token: string;
  private stock: string;

  onAgentInit(agent: Readonly<Agent>): PromiseOrValue<void> {
    this.agent = agent;
  }

  onMarketInit(marketService: Readonly<MarketService>): PromiseOrValue<void> {
    this.marketService = marketService;
  }

  onData(
    szenarioData: any[],
    token: string,
    stock: string,
    speedMultiplicator: number,
  ) {
    this.szenarioData = szenarioData;
    this.token = token;
    this.stock = stock;
    this.marketService.setWatch(1000, stock);
  }

  animate(): PromiseOrValue<void> {
    this.alive = true;
    this.currentTime
      .pipe(
        takeWhile((_) => this.alive),
        map((time) => addMinutes(this.startDate, time)),
      )
      .subscribe(async (time) => {
        console.log(time);
        const datapoint = this.szenarioData.find(
          (d) => new Date(d.time).getTime() === time.getTime(),
        );
        if (!datapoint) return;

        //delta sind prozentpunkte
        const currentMarket = await this.marketService.onInformationAvailable
          .pipe(take(1))
          .toPromise();

        // if (datapoint.delta < -0.01) {
        //   //notStonks
        // } else if (datapoint.delta > 0.01) {
        //   //Stonks
        // }

        const target = currentMarket * (1 + datapoint.delta);

        const diff = target - currentMarket;
        const volume = datapoint.volume;
        console.log(currentMarket, target);

        const matchingVolume = Math.floor(0.4 * volume);
        const limitSellVolume = Math.floor(0.1 * volume);
        const limitBuyVolume = Math.floor(0.1 * volume);

        this.marketService.placeOrder({
          stockCount: matchingVolume,
          aktenId: this.stock,
          operation: OperationType.BUY,
          price: target,
          token: this.token,
        });

        this.marketService.placeOrder({
          stockCount: matchingVolume,
          aktenId: this.stock,
          operation: OperationType.SELL,
          price: target,
          token: this.token,
        });

        for (let i = 0; i < 10; i++) {
          this.marketService.placeOrder({
            stockCount: Math.max(1, limitBuyVolume / 10),
            aktenId: this.stock,
            operation: OperationType.BUY,
            price: target - Math.random(),
            token: this.token,
          });
        }

        for (let i = 0; i < 10; i++) {
          this.marketService.placeOrder({
            stockCount: Math.max(1, limitSellVolume / 10),
            aktenId: this.stock,
            operation: OperationType.SELL,
            price: target + Math.random(),
            token: this.token,
          });
        }
      });
  }

  kill(): PromiseOrValue<void> {
    this.alive = false;
  }

  isAlive(): PromiseOrValue<boolean> {
    return this.alive;
  }
}
