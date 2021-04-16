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
  private marketService: Readonly<MarketService>;

  private startDate = null;
  private szenarioData: any;

  private token: string;
  private stock: string;
  private speedMultiplicator: number;

  onAgentInit(agent: Readonly<Agent>): PromiseOrValue<void> {}

  onMarketInit(marketService: Readonly<MarketService>): PromiseOrValue<void> {
    this.marketService = marketService;
  }

  private convertSpeedMultiplicator(factor: number) {
    return 60000 / factor;
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
    this.marketService.setWatch(
      this.convertSpeedMultiplicator(speedMultiplicator),
      stock,
    );

    const sorted = szenarioData
      .map(({ time }) => new Date(time))
      .sort((a, b) => a.getTime() - b.getTime());
    this.startDate = sorted[0];
  }

  animate(): PromiseOrValue<void> {
    this.alive = true;
    timer(0, this.convertSpeedMultiplicator(this.speedMultiplicator))
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

        const currentMarket = await this.marketService.onInformationAvailable
          .pipe(take(1))
          .toPromise();

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
