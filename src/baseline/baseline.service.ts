import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class BaselineService {

  private readonly logger = new Logger(BaselineService.name);

  @Cron('* * * * * *')
  runSimulation() {
    this.logger.debug('führe random trades aus');
  }

}
