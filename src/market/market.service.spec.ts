import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BaselineService } from '../baseline/baseline.service';
import { MarketService, OrderType, PlaceOrderInput } from './market.service';
import { createHash } from 'crypto';
import { take } from 'rxjs/operators';

const generateMockOrder = (): PlaceOrderInput => {
  return {
    aktenId: 'Testaktie',
    type: OrderType.SELL,
    price: 200,
    stockCount: 6000,
    subsequentOrders: [],
  };
};

const generateMockHash = (): string => {
  return createHash('md5')
    .update(JSON.stringify({ foo: 'bar' }))
    .digest('hex');
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

    const nestedMockOrder = generateMockOrder();

    nestedMockOrder.subsequentOrders = [generateMockOrder()];

    mockOrder.subsequentOrders = [generateMockOrder(), nestedMockOrder];

    await service.placeOrder(mockOrder);

    const callbackSpy = jest.spyOn(service, 'processCallback');

    // Wird zweimal aufgerufen, da .keys() ein Iterator ist und innerhalb von .processCallback, im Falle einer weiteren subequent Order,
    // nochmal .placeOrder aufgerufen wird. Da der Iterator synchron ist wird zuerst in .placeOrder ein neuer Eintrag hinzugefügt und
    // somit ist eine neuer Eintrag im Iterator vorhanden
    for (const orderHash of service.orderQueue.keys()) {
      service.processCallback(orderHash);
    }

    expect(callbackSpy).toBeCalledTimes(2);
  });

  it('should stop execution of callback if wrong hash is provided', async () => {
    const mockOrder = generateMockOrder();

    mockOrder.subsequentOrders = [generateMockOrder()];

    await service.placeOrder(mockOrder);
    const wrongHash = generateMockHash();

    expect(() => service.processCallback(wrongHash)).toThrow(
      'No order for given hash was enqueued',
    );

    expect(service.orderQueue.size).toEqual(1);
  });

  it('should generate new market data every second', (done) => {
    let counter = 0;
    service.onInformationAvailable.pipe(take(2)).subscribe({
      next: (v) => {
        expect(v).toBeDefined();
        counter++;
      },
      complete: () => {
        expect(counter).toEqual(2);
        done();
      },
    });
  });
});
