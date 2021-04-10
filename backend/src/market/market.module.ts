import { HttpModule, Module } from '@nestjs/common';
import { BaselineService } from 'src/baseline/baseline.service';
import { MarketService } from './market.service';

@Module({
  providers: [MarketService, BaselineService],
  exports: [MarketService],
  imports: [HttpModule]
})
export class MarketModule {}
