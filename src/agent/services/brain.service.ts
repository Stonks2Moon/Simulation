import { Injectable } from '@nestjs/common';

import { MarketService } from '../market.service';
import { Brain } from '../models/brain.model';
import { RandomBrain } from '../brains/random.brain';
import { Agent } from '../models/agent.model';

type Constructor<T> = new (...args: any[]) => T;

@Injectable()
export class BrainService {
  private registeredBrains = new Map<string, Constructor<Brain>>();

  constructor(private readonly marketService: MarketService) {
    this.registeredBrains.set('random', RandomBrain);
  }

  async brainFactory(agent: Agent, name: string): Promise<Brain> {
    const con = this.registeredBrains.get(name);
    const brainInstance =  new con();
    await brainInstance.onAgentInit(agent);
    await brainInstance.onMarketInit(this.marketService);
    await brainInstance.animate();
    return brainInstance;
  }
}
