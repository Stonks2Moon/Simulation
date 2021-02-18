import { Module } from '@nestjs/common';
import { AgentResolver } from './agent.resolver';
import { AgentService } from './agent.service';
import { BrainService } from './brain.service';
import { MarketService } from './market.service';

@Module({
  imports: [],
  providers: [AgentResolver, AgentService, BrainService, MarketService],
})
export class AgentModule {}
