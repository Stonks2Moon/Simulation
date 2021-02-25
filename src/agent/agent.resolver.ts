import { Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Agent } from './models/agent.model';
import { GraphQLString } from 'graphql';
import { AgentService } from './services/agent.service';
import { Cron } from '@nestjs/schedule';
import { Subject } from 'rxjs';
import { observableToAsyncIterable } from 'graphql-tools';
import { BrainService } from './services/brain.service';

const pubSub = new Subject<any>();

@Resolver((_) => Agent)
export class AgentResolver {
  constructor(
    private readonly agentService: AgentService,
    private readonly brainService: BrainService,
  ) {
    this.agentService.currentAgentsObservable.subscribe((v) => {
      pubSub.next({ agents: v }); // Die Property muss wie der subscriptionhandler heißen
    });
  }

  @Cron('* * * * * *')
  async runSimulation() {
    this.agentService.registerNewAgent(
      await this.agentService.agentFactory(Math.random() * 1000, 'random'),
    );
  }

  // @Mutation()
  // async createAgent() {}


  @Subscription((_) => [Agent])
  agents() {
    return observableToAsyncIterable(pubSub);
  }
}
