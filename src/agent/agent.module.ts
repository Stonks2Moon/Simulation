import { Module } from '@nestjs/common';

import { AgentService } from './services/agent.service';
import { BrainService } from './services/brain.service';
import { MarketController } from '../market/market.controller';
import { MarketModule } from '../market/market.module';

@Module({
  imports: [MarketModule],
  providers: [AgentService, BrainService],
  controllers: [MarketController],
})
export class AgentModule {}
