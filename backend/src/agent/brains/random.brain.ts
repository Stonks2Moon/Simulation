import { Logger, LoggerService } from '@nestjs/common';
import { timer } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { PromiseOrValue } from '../../util.types';
import { MarketService, OperationType } from '../../market/market.service';
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

  private token: string;
  private stock: string;

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
      .subscribe((v) => {
        this.logger.log(
          `Agent ${this.agent.id} with brain ${this.constructor.name} creates an order`,
        );

        const operation =
          Math.random() > 0.5 ? OperationType.BUY : OperationType.SELL;

        this.marketService.placeOrder({
          aktenId: this.stock,
          price:
            v +
            (operation === OperationType.SELL ? Math.random() : -Math.random()),
          stockCount: Math.ceil(Math.random() * 100),
          operation,

          token: this.token,
        });
      });
  }

  kill(): PromiseOrValue<void> {
    this.alive = false;
  }

  isAlive(): PromiseOrValue<boolean> {
    return this.alive;
  }

  onData(_: any, token: string, stock: string) {
    this.token = token;
    this.stock = stock;
  }
}
