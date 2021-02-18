import { Module } from '@nestjs/common';
import { AgentResolver } from './agent.resolver';

@Module({
  imports: [],
  providers: [AgentResolver],
})
export class AgentModule {}
