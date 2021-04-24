import { MarketService } from '../../market/market.service';
import { SzenarioBrain } from './szenario.brain';

describe('SzenarioBrain', () => {
  let brain: SzenarioBrain;

  beforeEach(() => {
    brain = new SzenarioBrain();
  });

  it('should be defined', () => {
    expect(brain).toBeDefined();
    brain.onMarketInit(new MarketService(null, null));
    expect(brain['convertSpeedMultiplicator'](60)).toBe(1000);
    expect(brain.getStatus()).toBe(0);
  });
});
