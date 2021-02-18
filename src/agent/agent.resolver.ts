import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Agent } from './agent.dto';
import { PubSub } from 'graphql-subscriptions';
import {  GraphQLString } from 'graphql';

const pubSub = new PubSub();

@Resolver((_) => Agent)
export class AgentResolver {
  @Query((_) => [Agent])
  async getAgent(
    @Args('id', { type: () => [Int], nullable: true }) ids: number[],
  ) {
    return [new Agent()];
  }

  @Subscription(_ => GraphQLString)
  commentAdded() {
    return pubSub.asyncIterator('commentAdded');
  }

  @Mutation(_ => GraphQLString)
  async addComment() {
    pubSub.publish('commentAdded', { commentAdded: 'test' });
    return 'test';
  }
}
