import { Module } from '@nestjs/common';

import { AgentService } from './services/agent.service';
import { BrainService } from './services/brain.service';
import { MarketModule } from '../market/market.module';

@Module({
  imports: [MarketModule],
  providers: [AgentService, BrainService],
})
export class AgentModule {}
