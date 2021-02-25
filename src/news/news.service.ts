import { Injectable } from '@nestjs/common';
const Slimbot = require('slimbot');

const slimbot = new Slimbot(process.env.TELEGRAM_BOT_TOKEN);

@Injectable()
export class NewsService {

  public sendNews(news: string) {
    slimbot.sendMessage(process.env.TELEGRAM_GROUP_ID, news)
  }

}
