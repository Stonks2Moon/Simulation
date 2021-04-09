import { BadRequestException, Injectable } from '@nestjs/common';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { from } from 'rxjs';
import { filter, map, mergeAll, switchMap, tap, toArray } from 'rxjs/operators';
import { Agent } from 'src/agent/models/agent.model';
import { AgentService } from 'src/agent/services/agent.service';

const SZENARIO_FOLDER = join(__dirname, '../assets/szenarios');

@Injectable()
export class SzenarioService {
  private availableSzenarios: {
    name: string;
    data: { time: string; valume: number; delta: number }[];
  }[] = [];

  private isRunningSzenario = false;
  private runningSzenario: number;
  private szenarioAgents: Agent[] = [];

  constructor(private readonly agentService: AgentService) {
    this.loadSzenarios();
  }

  private async loadSzenarios() {
    for (const fileName of await readdir(SZENARIO_FOLDER)) {
      if (!fileName.startsWith('Transformed')) continue;

      const path = join(SZENARIO_FOLDER, fileName);
      const contents = JSON.parse(await readFile(path, 'utf-8'));
      this.availableSzenarios.push({
        name: fileName,
        data: contents,
      });
    }
  }

  public getSzenario(id: number) {
    if (id > this.availableSzenarios.length) throw new BadRequestException();
    console.log(this.availableSzenarios[id]);
    return this.availableSzenarios[id];
  }

  get(id?: number) {
    if (id) return this.getSzenario(id);
    return this.availableSzenarios;
  }

  async runSzenario(szenarioId: number) {
    await Promise.all(this.szenarioAgents.map((agent) => agent.brain.kill()));
    this.szenarioAgents = [];

    this.isRunningSzenario = true; //TODO: Ende des szenarios
    this.runningSzenario = szenarioId;
    const agent = await this.agentService.agentFactory(
      'szenario',
      this.getSzenario(szenarioId).data,
    );
    this.szenarioAgents.push(agent);

    const agent2 = await this.agentService.agentFactory(
      'random',
      this.getSzenario(szenarioId).data,
    );
    this.szenarioAgents.push(agent2);
  }
}
