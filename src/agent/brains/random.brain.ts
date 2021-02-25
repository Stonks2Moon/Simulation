import { Logger, LoggerService } from '@nestjs/common';
import { timer } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { PromiseOrValue } from '../../util.types';
import { MarketService, OrderType } from '../../market/market.service';
import { Agent } from '../models/agent.model';
import { Brain } from '../models/brain.model';

/**
 * A Random Test-Brain, which creates orders as it pleases
 */
export class RandomBrain extends Brain {
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
      .subscribe(() => {
        this.logger.log(
          `Agent ${this.agent.id} with brain ${this.constructor.name} creates an order`,
        );
        this.marketService.placeOrder({
          aktenId: '',
          price: Math.random(),
          type: Math.random() > 0 ? OrderType.BUY : OrderType.SELL,
          stockCount: Math.ceil(Math.random() * 100),
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
