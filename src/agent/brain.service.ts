import { Injectable } from '@nestjs/common';
import { MarketService } from '../agent/market.service';
import { Agent } from './models/agent.model';
import { Brain } from './brain.model';
import { RandomBrain } from './brains/random.brain';

type Constructor<T> = new (...args: any[]) => T;

@Injectable()
export class BrainService {
  private registeredBrains = new Map<string, Constructor<Brain>>();

  constructor(private readonly marketService: MarketService) {
    this.registeredBrains.set('random', RandomBrain);
  }

  brainFactory(agent: Agent, name: string): Brain {
    const con = this.registeredBrains.get(name);
    return new con(this.marketService, agent);
  }
}