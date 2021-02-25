import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BaselineService } from '../baseline/baseline.service';
import { AgentModule } from './agent.module';
import { MarketService, OrderType, PlaceOrderInput } from './market.service';

const generateMockOrder = (): PlaceOrderInput => {
  return {
    type: OrderType.SELL,
    price: 200,
    stockCount: 6000,
    subsequentOrders: [],
  };
};

describe('MarketService', () => {
  let service: MarketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [MarketService, BaselineService],
    }).compile();

    service = module.get<MarketService>(MarketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should store orders properly', async () => {
    const mockOrder = generateMockOrder();

    await service.placeOrder(mockOrder);
    expect(service.orderQueue.size).toEqual(0);

    mockOrder.subsequentOrders = [generateMockOrder()];

    await service.placeOrder(mockOrder);
    expect(service.orderQueue.size).toEqual(1);
  });

  it('should process subsequent orders after callback trigger', async () => {
    const mockOrder = generateMockOrder();

    mockOrder.subsequentOrders = [generateMockOrder(), generateMockOrder()];
  });
});
