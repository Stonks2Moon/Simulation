import { Controller, Get, Param } from '@nestjs/common';
import { MarketService } from './market.service';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('/callback/:reference')
  public marketCallback(@Param() reference: string) {
    // this.marketService.processCallback(reference);
  }
}
