import { Query, Resolver, Subscription } from '@nestjs/graphql';
import { Agent } from './agent.model';
import { GraphQLString } from 'graphql';
import { AgentService } from './agent.service';
import { Cron } from '@nestjs/schedule';
import { Subject } from 'rxjs';
import { observableToAsyncIterable } from 'graphql-tools';

const pubSub = new Subject<any>();

@Resolver((_) => Agent)
export class AgentResolver {
  constructor(private readonly agentService: AgentService) {
    this.agentService.currentAgentsObservable.subscribe((v) => {
      pubSub.next({ agents: v }); // Die Property muss wie der subscriptionhandler heißen
    });
  }

  @Cron('* * * * * *')
  runSimulation() {
    this.agentService.registerNewAgent(
      this.agentService.agentFactory(Math.random() * 1000, 'random'),
    );
  }

  @Query((_) => GraphQLString)
  async isRunning() {
    return 'Jop';
  }

  @Subscription((_) => [Agent])
  agents() {
    return observableToAsyncIterable(pubSub);
  }
}
