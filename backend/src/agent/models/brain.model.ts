import { PromiseOrValue } from 'src/util.types';
import { MarketService } from '../../market/market.service';
import { Agent } from './agent.model';

export abstract class Brain {
  /**
   * The Brainname
   */
  name = this.constructor.name;

  /**
   * Registers a master agent
   * @param agent The Agent, which owns the brain.
   */
  abstract onAgentInit(agent: Readonly<Agent>): PromiseOrValue<void>;

  /**
   * Registers the global stock market
   * @param marketService The Global Stockmarket
   */
  abstract onMarketInit(
    marketService: Readonly<MarketService>,
  ): PromiseOrValue<void>;

  /**
   * Returns the finishing state in percent
   * @returns the percent of finished or null if no state is important
   */
  getStatus(): number | null {
    return null;
  }

  /**
   * Registers additional data which the brain can use for decision making.
   * Data is provided when creating a brain or an agent
   * @param data The additional data to provide to the brain.
   */
  onData(...data: any[]): PromiseOrValue<void> {}

  /**
   * The Go command, at which all participating components are constructed.
   * At this point, the Brain is free to do whatever;
   */
  abstract animate(): PromiseOrValue<void>;

  /**
   * Signals a Brain, to stop what its doing and cleanup resources.
   */
  abstract kill(): PromiseOrValue<void>;

  /**
   * Checks if the brain is still alive. The Brain may be reinitialized.
   */
  abstract isAlive(): PromiseOrValue<boolean>;
}
