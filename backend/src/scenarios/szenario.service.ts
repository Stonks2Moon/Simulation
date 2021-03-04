import { BadRequestException, Injectable } from '@nestjs/common';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { from } from 'rxjs';
import {
  map,
  mergeAll,
  switchMap,
  toArray,
} from 'rxjs/operators';

const SZENARIO_FOLDER = join(__dirname, '../assets/szenarios');

@Injectable()
export class SzenarioService {
  private availableSzenarios = [];

  constructor() {
    this.loadSzenarios();
  }

  private async loadSzenarios() {
    this.availableSzenarios = await from(readdir(SZENARIO_FOLDER))
      .pipe(
        mergeAll(),
        map((fileName) => join(SZENARIO_FOLDER, fileName)),
        map((path) => readFile(path, 'utf-8')),
        toArray(),
        switchMap((files) => Promise.all(files)),
        mergeAll(),
        map((fileContent) => JSON.parse(fileContent)),
        toArray(),
      )
      .toPromise();
  }

  public getSzenario(id: number) {
    console.log(this.availableSzenarios[1]);
    if (id > this.availableSzenarios.length) throw new BadRequestException();
    const a = this.availableSzenarios[id];
    console.log(a, id);
    return a;
  }
}
