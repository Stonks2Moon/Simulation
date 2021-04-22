import { HttpModule, Module } from '@nestjs/common';
import { MarketService } from './market.service';

@Module({
  providers: [MarketService],
  exports: [MarketService],
  imports: [HttpModule]
})
export class MarketModule {}
