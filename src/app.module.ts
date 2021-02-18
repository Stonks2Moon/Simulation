import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { AgentModule } from './agent/agent.module';
import { join } from 'path';

@Module({
  imports: [GraphQLModule.forRoot({
    autoSchemaFile: true,
  }), AgentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
