import { Module } from '@nestjs/common';
import { AgentModule } from '../agent/agent.module';
import { SzenarioController } from './szenario.controller';
import { SzenarioService } from './szenario.service';

@Module({
  controllers: [SzenarioController],
  providers: [SzenarioService],
  imports: [AgentModule],
})
export class SzenarioModule {}
