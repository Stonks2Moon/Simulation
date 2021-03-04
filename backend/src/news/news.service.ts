import { Injectable } from '@nestjs/common';
import { join } from 'path';
import * as Slimbot from 'slimbot';
import { createReadStream, ReadStream } from 'fs';
import { ConfigService } from '@nestjs/config';

interface ISlimbot {
  sendMessage(code: string, message: string): Promise<any>;
  sendPhoto(code: string, file: ReadStream): Promise<any>;
}

@Injectable()
export class NewsService {
  private slimbot: ISlimbot;
  private chatId: string;

  constructor(configService: ConfigService) {
    this.slimbot = new Slimbot(
      configService.get<string>('TELEGRAM_BOT_TOKEN'),
    );
    this.chatId = configService.get<string>("TELEGRAM_GROUP_ID")
  }

  public sendNews(message: string) {
    return this.slimbot.sendMessage(this.chatId, message);
  }

  public stonks() {
    const stonksFile = createReadStream(
      join(__dirname, '../assets/stonks.jpg'),
    );
    return this.slimbot.sendPhoto(this.chatId, stonksFile);
  }

  public notStonks() {
    const notStonksFile = createReadStream(
      join(__dirname, '../assets/notstonks.jpg'),
    );
    return this.slimbot.sendPhoto(this.chatId, notStonksFile);
  }
}
