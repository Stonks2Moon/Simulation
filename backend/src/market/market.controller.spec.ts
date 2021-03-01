import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BaselineService } from '../baseline/baseline.service';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';

describe('MarketController', () => {
  let controller: MarketController;
  let service: MarketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [MarketController],
      providers: [MarketService, ConfigService, BaselineService],
    }).compile();

    controller = module.get<MarketController>(MarketController);
    service = module.get<MarketService>(MarketService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call MarketService with correct parameter', () => {
    const inputHash = 'mypropertransactionhash';

    let counter = 0;

    jest.spyOn(service, 'processCallback').mockImplementation((hash) => {
      expect(hash).toEqual(inputHash);
      counter++;
    });

    controller.marketCallback(inputHash);

    expect(counter).toEqual(1)
    
    controller.marketCallback(inputHash);
    controller.marketCallback(inputHash);
    
    expect(counter).toEqual(3)
  });
});
