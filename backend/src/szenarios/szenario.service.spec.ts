import { Test, TestingModule } from '@nestjs/testing';
import { AgentService } from '../agent/services/agent.service';
import { NewsService } from '../news/news.service';
import { SzenarioService } from './szenario.service';
import { SzenarioStartDto } from './szenarioStart.dto';

jest.mock('fs/promises', () => ({
  readdir: async () => ['test'],
  readFile: async () => '{}',
}));

jest.mock('path');

describe('SzenarioService', () => {
  let service: SzenarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SzenarioService,
        {
          provide: AgentService,
          useValue: {
            agentFactory: jest.fn(),
          },
        },
        {
          provide: NewsService,
          useValue: {
            sendNews: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SzenarioService>(SzenarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get Szenario progress', async () => {
    let percentage = await service.getSzenarioProgress();
    expect(percentage).toBe(100);

    service['runningSzenario'] = 0;
    service['isRunningSzenario'] = true;

    percentage = await service.getSzenarioProgress();
    expect(percentage).toBeNaN();
  });

  it('should get szenario', async () => {
    const s = await service.get();

    expect(s.length).toBe(1);

    const sid = await service.get(0);

    expect(sid).toBeDefined();
  });

  it('should run a szenario', async () => {
    const dto = new SzenarioStartDto();
    dto.szenario = 0;
    await service.runSzenario(dto, '');
  });

  it('should stop all szenarios', async () => {
      await service.stopCurrentSzenario()
  })
});
