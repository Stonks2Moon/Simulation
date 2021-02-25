import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgentResolver } from './agent.resolver';
import { AgentService } from './agent.service';
import { BrainService } from './brain.service';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';

@Module({
  imports: [ConfigModule],
  providers: [AgentResolver, AgentService, BrainService, MarketService],
  controllers: [MarketController],
})
export class AgentModule {}
