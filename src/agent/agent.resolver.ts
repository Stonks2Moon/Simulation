import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Agent } from './agent.dto';

@Resolver((_) => Agent)
export class AgentResolver {
  @Query((_) => Agent)
  async author(@Args('id', { type: () => Int }) id: number) {
    return new Agent();
  }
}
