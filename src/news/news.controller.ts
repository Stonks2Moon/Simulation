import { Body, Controller, Post } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  public sendNews(@Body() { news }) {
    this.newsService.sendNews(news);
  }

  @Post()
  public stonks() {
    this.newsService.stonks();
  }

  @Post()
  public notStonks() {
    this.newsService.notStonks();
  }
}
