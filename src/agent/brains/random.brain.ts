import { MarketService } from '../market.service';
import { Agent } from '../models/agent.model';
import { Brain } from '../models/brain.model';

export class RandomBrain extends Brain {

  

  kill() {
    throw new Error('Method not implemented.');
  }
  animate() {
    throw new Error('Method not implemented.');
  }

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


  onAgentInit(agent: Readonly<Agent>) {
   
  }
  onMarketInit(marketService: Readonly<MarketService>) {
   
  }

  



  act() {
    const order = {};
    // TODO:
    console.log(`Agent ${this.agent.id} created an order`);
  }
}
