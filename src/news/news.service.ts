import { Injectable } from '@nestjs/common';
const Slimbot = require('slimbot');
const fs = require('fs');

const slimbot = new Slimbot('1655303947:AAHNNqcRUt9qZ6q0fVtC7HVU11_JNu93-Bg');

const stonksFile = fs.createReadStream(__dirname + '../assets/stonks.jpg');
const notStonksFile = fs.createReadStream(__dirname + '../assets/notstonks.jpg');

@Injectable()
export class NewsService {

  public sendNews(news: string) {
    slimbot.sendMessage('-579864936', news)
  }

  public stonks() {
    slimbot.sendPhoto('-579864936', stonksFile)
  }

  public notStonks() {
    slimbot.sendPhoto('-579864936', notStonksFile)
  }

}
