import { Test, TestingModule } from '@nestjs/testing';
import { Agent } from '../models/agent.model';
import { AgentService } from './agent.service';
import { BrainService } from './brain.service';

describe('AgentService', () => {
  let service: AgentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentService,
        {
          provide: BrainService,
          useValue: {
            brainFactory: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AgentService>(AgentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to register a new agent', () => {
    const mockAgent = new Agent();
    service.registerNewAgent(mockAgent);

    expect(service.currentAgents).toContain(mockAgent);
  });

  it('should create an agent', async () => {
    const agent = await service.agentFactory(100, 'random');
    expect(agent).toBeInstanceOf(Agent);
  });

  // it('should create an agent with correct brain', () => {
  //   // const agent = service.agentFactory(100, 'random');
  //   // expect(agent.brain).toBeInstanceOf(RandomBrain);
  // });
});
