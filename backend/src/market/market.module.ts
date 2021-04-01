import { HttpModule, Module } from '@nestjs/common';
import { BaselineService } from 'src/baseline/baseline.service';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';

@Module({
  providers: [MarketService, BaselineService],
  controllers: [MarketController],
  exports: [MarketService],
  imports: [HttpModule]
})
export class MarketModule {}
