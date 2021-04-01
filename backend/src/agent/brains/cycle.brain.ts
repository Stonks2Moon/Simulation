import { Logger } from '@nestjs/common';
import { takeWhile } from 'rxjs/operators';

import { PromiseOrValue } from '../../util.types';
import {
  MarketService,
  OperationType,
  PlaceOrderInput,
} from '../../market/market.service';
import { Agent } from '../models/agent.model';
import { Brain } from '../models/brain.model';

const sleep = (time: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });

/**
 * A Brain, which buyes and sells more or less same trades.
 */
export class CycleBrain extends Brain {
  private alive = false;
  private agent: Readonly<Agent>;
  private marketService: Readonly<MarketService>;
  private logger = new Logger();

  onAgentInit(agent: Readonly<Agent>): PromiseOrValue<void> {
    this.agent = agent;
  }

  onMarketInit(marketService: Readonly<MarketService>): PromiseOrValue<void> {
    this.marketService = marketService;
  }

  animate(): PromiseOrValue<void> {
    this.alive = true;
    this.marketService.onInformationAvailable
      .pipe(takeWhile(() => this.alive))
      .subscribe(async () => {
        this.logger.log(
          `Agent ${this.agent.id} with brain ${this.constructor.name} creates an order`,
        );

        const order: PlaceOrderInput = {
          aktenId: 'Moon',
          price: Math.random(),
          stockCount: Math.ceil(Math.random() * 100),
          operation: OperationType.BUY
        };
        this.marketService.placeOrder(order);

        await sleep(1000);

        const sellOrder = { ...order, operation: OperationType.SELL };
        this.marketService.placeOrder(sellOrder);

        await sleep(1000);
      });
  }

  kill(): PromiseOrValue<void> {
    this.alive = false;
  }

  isAlive(): PromiseOrValue<boolean> {
    return this.alive;
  }

}
