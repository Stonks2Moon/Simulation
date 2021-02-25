import { Module } from '@nestjs/common';
import { AgentResolver } from './agent.resolver';

import { AgentService } from './services/agent.service';
import { BrainService } from './services/brain.service';
import { MarketController } from '../market/market.controller';
import { MarketModule } from '../market/market.module';

@Module({
  imports: [MarketModule],
  providers: [AgentResolver, AgentService, BrainService],
  controllers: [MarketController],
})
export class AgentModule {}
