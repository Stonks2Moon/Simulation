import { Test, TestingModule } from '@nestjs/testing';
import { Agent } from '../models/agent.model';
import { BrainService } from './brain.service';
import { MarketService } from '../../market/market.service';
import { Brain } from '../models/brain.model';
import { of } from 'rxjs';

describe('BrainService', () => {
  let service: BrainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrainService,
        {
          provide: MarketService,
          useValue: {
            onInformationAvailable: of(),
          },
        },
      ],
    }).compile();

    service = module.get<BrainService>(BrainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a brain', async () => {
    const mockAgent = new Agent();
    expect(await service.brainFactory(mockAgent, 'random')).toBeInstanceOf(
      Brain,
    );
  });
});
