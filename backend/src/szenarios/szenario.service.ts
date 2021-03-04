import { BadRequestException, Injectable } from '@nestjs/common';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { from } from 'rxjs';
import { map, mergeAll, switchMap, toArray } from 'rxjs/operators';
import { AgentService } from 'src/agent/services/agent.service';
import { BrainService } from 'src/agent/services/brain.service';

const SZENARIO_FOLDER = join(__dirname, '../assets/szenarios');

@Injectable()
export class SzenarioService {
  private availableSzenarios = [];

  constructor(private readonly agentService: AgentService) {
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

    //TEMP
    this.availableSzenarios = [this.availableSzenarios[9]];


        //TEMP
      await  this.agentService.agentFactory(0,'szenario')

  } // TODO: Add filter for non transformed jsons

  public getSzenario(id: number) {
    if (id > this.availableSzenarios.length) throw new BadRequestException();
    return this.availableSzenarios[id];
  }

  get() {
    console.log(this.availableSzenarios.length);
    return this.availableSzenarios;
  }
}
