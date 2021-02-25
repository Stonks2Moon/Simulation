import { Injectable } from '@nestjs/common';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { MarketService } from 'src/agent/market.service';
import { Agent } from './agent.model';
import { BrainService } from './brain.service';

@Injectable()
export class AgentService {
  private readonly _agents = new BehaviorSubject<Agent[]>([]);

  constructor(private readonly brainService: BrainService){

  }

  get currentAgentsObservable() {
    return this._agents.asObservable();
  }

  get currentAgents() {
    return this._agents.getValue();
  }

  registerNewAgent(agent: Readonly<Agent>) {
    const currentAgents = this._agents.getValue();
    this._agents.next([agent, ...currentAgents]);
  }

  agentFactory(funds: number, brain: string) {
    const agent = new Agent();
    agent.brain = this.brainService.brainFactory(agent, brain);
    agent.funds = funds;
    return agent;
  }
}
