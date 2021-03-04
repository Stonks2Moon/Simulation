import { Body, Controller, Post } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  public sendNews(@Body() { message }) {
    return this.newsService.sendNews(message);
  }

  @Post('stonks')
  public stonks() {
    return this.newsService.stonks();
  }

  @Post('notstonks')
  public notStonks() {
    return this.newsService.notStonks();
  }
}
