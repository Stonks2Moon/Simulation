import { Module } from '@nestjs/common';
import { AgentResolver } from './agent.resolver';
import { AgentService } from './agent.service';

@Module({
  imports: [],
  providers: [AgentResolver, AgentService],
})
export class AgentModule {}
