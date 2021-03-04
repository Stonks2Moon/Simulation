import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

jest.mock('slimbot');

const CHAT_ID = '-579864936';

describe('NewsController', () => {
  let controller: NewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [NewsController],
      providers: [
        {
          provide: NewsService,
          useValue: {
            sendNews(message: string) {
              return {
                ok: true,
                result: { text: message },
              };
            },
            stonks() {
              return {
                ok: true,
                result: { photo: new Array(1) },
              };
            },
            notStonks() {
              return {
                ok: true,
                result: { photo: new Array(1) },
              };
            },
          },
        },
      ],
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

    controller = module.get<NewsController>(NewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should send message and return telegram response', async () => {
    const message = `${new Date().toISOString()} --- This is a test message, please ignore!`;

    const response = await controller.sendNews({ message });

    expect(response.ok).toBeTruthy();
    expect(response.result.text).toEqual(message);
  });

  it('should send stonks.jpg and return telegram response', async () => {
    const response = await controller.stonks();

    expect(response.ok).toBeTruthy();
    expect(response.result.photo).not.toHaveLength(0);
  });

  it('should send notstonks.jpg and return telegram response', async () => {
    const response = await controller.notStonks();

    expect(response.ok).toBeTruthy();
    expect(response.result.photo).not.toHaveLength(0);
  });
});
