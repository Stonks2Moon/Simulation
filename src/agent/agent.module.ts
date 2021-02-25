import { Module } from '@nestjs/common';
import { AgentResolver } from './agent.resolver';
import { AgentService } from './services/agent.service';
import { BrainService } from './services/brain.service';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import { BrainResolver } from './brain.resolver';

@Module({
  providers: [
    AgentResolver,
    BrainResolver,
    AgentService,
    BrainService,
    MarketService,
  ],
  controllers: [MarketController],
})
export class AgentModule {}
