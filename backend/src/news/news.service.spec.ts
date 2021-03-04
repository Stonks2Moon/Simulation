import { Test, TestingModule } from '@nestjs/testing';
import { NewsService } from './news.service';
import * as fs from 'fs';
import { ConfigModule, ConfigService } from '@nestjs/config';

jest.mock('slimbot');
jest.mock('fs');

const CHAT_ID = '-579864936';

describe('NewsService', () => {
  let service: NewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [NewsService],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: (key: string): string => {
          switch (key) {
            case 'TELEGRAM_BOT_TOKEN':
              return 'BOT_TOKEN';
            case 'TELEGRAM_GROUP_ID':
              return CHAT_ID;
            default:
              break;
          }
        },
      })
      .compile();

    service = module.get<NewsService>(NewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send a text message to a telegram group', () => {
    const slimbot = service['slimbot'];
    const slimSpy = jest.spyOn(slimbot, 'sendMessage');

    service.sendNews('Test Message');

    expect(slimSpy).toHaveBeenCalledTimes(1);
    expect(slimSpy).toHaveBeenCalledWith(CHAT_ID, 'Test Message');
  });

  it('should send the stonks photo in a telegram group', () => {
    const slimbot = service['slimbot'];
    const slimSpy = jest.spyOn(slimbot, 'sendPhoto');

    service.stonks();

    expect(fs.createReadStream).toHaveBeenCalledTimes(1);
    expect(slimSpy).toHaveBeenCalledTimes(1);
  });

  it('should send the notStonks photo in a telegram group', () => {
    const slimbot = service['slimbot'];
    const slimSpy = jest.spyOn(slimbot, 'sendPhoto');

    service.notStonks();

    expect(fs.createReadStream).toHaveBeenCalledTimes(1);
    expect(slimSpy).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
