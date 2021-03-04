import { Test, TestingModule } from '@nestjs/testing';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

describe('NewsController', () => {
  let controller: NewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [NewsService],
    }).compile();

    controller = module.get<NewsController>(NewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should send message and return telegram response', async () => {
    const message = `${new Date().toISOString()} --- This is a test message, please ignore!`;

    const response = await controller.sendNews({ message });

    expect(response).toBeDefined();
    expect(response.ok).toBeTruthy();
    expect(response.result.text).toEqual(message);
  });

  it('should send stonks.jpg and return telegram response', async () => {
    const response = await controller.stonks();

    expect(response).toBeDefined();
    expect(response.ok).toBeTruthy();
    expect(response.result.photo).not.toHaveLength(0)
  });

  it('should send notstonks.jpg and return telegram response', async () => {
    const response = await controller.notStonks();

    expect(response).toBeDefined();
    expect(response.ok).toBeTruthy();
    expect(response.result.photo).not.toHaveLength(0)
  });
});
