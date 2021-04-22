import { Module } from '@nestjs/common';
import { NewsModule } from 'src/news/news.module';
import { AgentModule } from '../agent/agent.module';
import { SzenarioController } from './szenario.controller';
import { SzenarioService } from './szenario.service';

@Module({
  controllers: [SzenarioController],
  providers: [SzenarioService],
  imports: [AgentModule, NewsModule],
})
export class SzenarioModule {}
