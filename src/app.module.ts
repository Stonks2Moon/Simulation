import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ScheduleModule } from '@nestjs/schedule';
import { BaselineService } from './baseline/baseline.service';
import { GraphQLModule } from '@nestjs/graphql';
import { AgentModule } from './agent/agent.module';
import { ConfigModule } from '@nestjs/config';
import { NewsModule } from './news/news.module';
import { MarketModule } from './market/market.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    AgentModule,
    MarketModule,
    NewsModule
  ],
  controllers: [AppController],
  providers: [AppService, BaselineService],
})
export class AppModule {}
