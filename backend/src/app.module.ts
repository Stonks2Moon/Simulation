import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AgentModule } from './agent/agent.module';
import { ConfigModule } from '@nestjs/config';
import { NewsModule } from './news/news.module';
import { MarketModule } from './market/market.module';
import { SzenarioModule } from './szenarios/szenario.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    AgentModule,
    MarketModule,
    NewsModule,
    SzenarioModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
