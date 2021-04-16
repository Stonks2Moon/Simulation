import { Injectable } from '@nestjs/common';

import { MarketService } from '../../market/market.service';
import { Brain } from '../models/brain.model';
import { RandomBrain } from '../brains/random.brain';
import { Agent } from '../models/agent.model';
import { SzenarioBrain } from '../brains/szenario.brain';

type Constructor<T> = new (...args: any[]) => T;

@Injectable()
export class BrainService {
  private registeredBrains = new Map<string, Constructor<Brain>>();

  constructor(private readonly marketService: MarketService) {
    this.registeredBrains.set('random', RandomBrain);
    this.registeredBrains.set('szenario', SzenarioBrain);
  }

  async brainFactory(agent: Agent, name: string, ...data: any[]): Promise<Brain> {
    const con = this.registeredBrains.get(name);
    const brainInstance = new con();
    await brainInstance.onAgentInit(agent);
    await brainInstance.onMarketInit(this.marketService);
    await brainInstance.onData(...data);
    await brainInstance.animate();
    return brainInstance;
  }

  getAvailableBrains() {
    return this.registeredBrains.keys();
  }
}
