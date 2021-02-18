import { MarketService } from './market.service';
import { Agent } from './agent.model';
import { Brain } from './brain.model';

export class RandomBrain extends Brain {
  constructor(
    private readonly marketService: MarketService,
    private readonly agent: Agent,
  ) {
    super();
    this.marketService.onInformationAvailable.subscribe((information) => {
      setTimeout(() => {
        this.act();
      }, Math.random() * 1000); // Brainlag
      this.act();
    });
  }

  act() {
    const order = {};
    // TODO:
    console.log(`Agent ${this.agent.id} created an order`);
  }
}
