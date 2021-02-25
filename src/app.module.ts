import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ScheduleModule } from '@nestjs/schedule';
import { BaselineService } from './baseline/baseline.service';
import { GraphQLModule } from '@nestjs/graphql';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
    }),
    AgentModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, BaselineService],
})
export class AppModule {}
