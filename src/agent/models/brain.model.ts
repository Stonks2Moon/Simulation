import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';
import { MarketService } from '../market.service';
import { Agent } from './agent.model';

@ObjectType()
export abstract class Brain {
  /**
   * The Brainname
   */
  @Field((_) => GraphQLString)
  name = this.constructor.name;

  /**
   * Registers a master agent
   * @param agent The Agent, which owns the brain.
   */
  abstract onAgentInit(agent: Readonly<Agent>);

  /**
   * Registers the global stock marget
   * @param marketService The Global Stockmarket
   */
  abstract onMarketInit(marketService: Readonly<MarketService>);

  /**
   * The Go command, at which all participating components are constructed.
   * At this point, the Brain is free to do whatever;
   */
  abstract animate();

  /**
   * Signals a Brain, to stop what its doing and cleanup resources.
   */
  abstract kill();

  /** 
   * Checks if the brain is still alive. The Brain may be reinitialized.
  */
  abstract isAlive(): boolean;
}
