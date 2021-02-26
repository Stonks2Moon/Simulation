import { Test, TestingModule } from '@nestjs/testing';
import { BaselineService } from './baseline.service';

describe('BaselineService', () => {
  let service: BaselineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaselineService],
    }).compile();

    service = module.get<BaselineService>(BaselineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
