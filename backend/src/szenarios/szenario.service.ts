import { BadRequestException, Injectable } from '@nestjs/common';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { from } from 'rxjs';
import { filter, map, mergeAll, switchMap, toArray } from 'rxjs/operators';
import { AgentService } from 'src/agent/services/agent.service';

const SZENARIO_FOLDER = join(__dirname, '../assets/szenarios');

@Injectable()
export class SzenarioService {
  private availableSzenarios = [];

  private isRunningSzenario = false;
  private runningSzenario: number;

  constructor(private readonly agentService: AgentService) {
    this.loadSzenarios();
  }

  private async loadSzenarios() {
    this.availableSzenarios = await from(readdir(SZENARIO_FOLDER))
      .pipe(
        mergeAll(),
        filter((fileName) => fileName.startsWith('Transformed')),
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
    if (id > this.availableSzenarios.length) throw new BadRequestException();
    return this.availableSzenarios[id];
  }

  get() {
    return this.availableSzenarios;
  }

  runSzenario(szenarioId: number) {
    this.agentService.agentFactory('szenario', this.getSzenario(szenarioId));
  }
}
