import { Controller, Get, Param } from '@nestjs/common';
import { MarketService } from './market.service';

@Controller('market-callback')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get(':reference')
  public marketCallback(
    @Param() reference: string
  ) {
    // this.marketService.processCallback(reference);
  }
}
