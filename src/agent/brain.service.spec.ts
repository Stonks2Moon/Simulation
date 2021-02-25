import { Test, TestingModule } from '@nestjs/testing';
import { Agent } from './models/agent.model';
import { AgentService } from './agent.service';
import { BrainService } from './brain.service';
import { MarketService } from './market.service';

describe('BrainService', () => {
  let service: BrainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrainService,
        {
          provide: MarketService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<BrainService>(BrainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
