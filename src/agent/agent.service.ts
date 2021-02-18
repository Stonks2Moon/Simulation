import { Injectable } from '@nestjs/common';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Agent } from './agent.dto';

@Injectable()
export class AgentService {
  private readonly _agents = new BehaviorSubject<Agent[]>([]);

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
}
