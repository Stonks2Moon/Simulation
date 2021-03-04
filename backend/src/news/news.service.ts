import { Injectable } from '@nestjs/common';
import { join } from 'path';
import * as Slimbot from 'slimbot';
import { createReadStream } from 'fs';

const slimbot = new Slimbot('1655303947:AAHNNqcRUt9qZ6q0fVtC7HVU11_JNu93-Bg');

@Injectable()
export class NewsService {
  public sendNews(message: string) {
    return slimbot.sendMessage('-579864936', message);
  }

  public stonks() {
    const stonksFile = createReadStream(join(__dirname, '../assets/stonks.jpg'));
    return slimbot.sendPhoto('-579864936', stonksFile);
  }

  public notStonks() {
    const notStonksFile = createReadStream(
      join(__dirname, '../assets/notstonks.jpg'),
    );
    return slimbot.sendPhoto('-579864936', notStonksFile);
  }
}
