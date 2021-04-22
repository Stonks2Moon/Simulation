import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { from } from 'rxjs';
import { filter, map, mergeAll, switchMap, tap, toArray } from 'rxjs/operators';
import { Agent } from 'src/agent/models/agent.model';
import { AgentService } from 'src/agent/services/agent.service';
import { NewsService } from 'src/news/news.service';
import { SzenarioStartDto } from './szenarioStart.dto';

const SZENARIO_FOLDER = join(__dirname, '../assets/szenarios');

class Data {
  @ApiProperty({
    description: 'When a order will be placed',
  })
  time: string;

  @ApiProperty({
    description: 'The order volume',
  })
  volume: number;

  @ApiProperty({
    description: 'The stock change rate',
  })
  delta: number;
}

export class Szenario {
  @ApiProperty({
    description: 'The id of the szenario',
  })
  id: number;

  @ApiProperty({
    description: 'The name of the szenario',
  })
  name: string;

  @ApiProperty({
    description: 'The szenario information, which will be used in the szenario',
    type: [Data],
  })
  data: Data[];
}

@Injectable()
export class SzenarioService {
  private availableSzenarios: Szenario[] = [];

  private isRunningSzenario = false;
  private runningSzenario: number;
  private szenarioAgents: Agent[] = [];

  constructor(
    private readonly agentService: AgentService,
    private readonly newsService: NewsService
  ) {
    this.loadSzenarios();
  }

  async getSzenarioProgress() {
    if (this.runningSzenario === null || !this.isRunningSzenario) return 100;

    const percentages = this.szenarioAgents
      .map(({ brain }) => brain.getStatus())
      .filter((v) => v !== null);
    return percentages.reduce((a, b) => a + b, 0) / percentages.length;
  }

  private async loadSzenarios() {
    for (const fileName of await readdir(SZENARIO_FOLDER)) {
      const path = join(SZENARIO_FOLDER, fileName);
      const contents = JSON.parse(await readFile(path, 'utf-8'));
      this.availableSzenarios.push({
        id: this.availableSzenarios.length,
        name: fileName.replace('.json', ''),
        data: contents,
      });
    }
  }

  public getSzenario(id: number) {
    if (id > this.availableSzenarios.length) throw new BadRequestException();
    return this.availableSzenarios[id];
  }

  get(): Szenario[];
  get(id: number): Szenario;
  get(id?: number): Szenario | Szenario[] {
    if (id) return this.getSzenario(id);
    return this.availableSzenarios;
  }

  async runSzenario(szenario: SzenarioStartDto, token: string) {
    await Promise.all(this.szenarioAgents.map((agent) => agent.brain.kill()));
    this.szenarioAgents = [];

    this.isRunningSzenario = true; //TODO: Ende des szenarios
    this.runningSzenario = szenario.szenario;

    await this.newsService.sendNews(szenario.message);

    const agent = await this.agentService.agentFactory(
      'szenario',
      this.getSzenario(szenario.szenario).data,
      token,
      szenario.stock,
      szenario.speedMultiplicator,
    );
    this.szenarioAgents.push(agent);

    const agent2 = await this.agentService.agentFactory(
      'random',
      this.getSzenario(szenario.szenario).data,
      token,
      szenario.stock,
      szenario.speedMultiplicator,
    );
    this.szenarioAgents.push(agent2);
  }

  async stopCurrentSzenario() {
    await Promise.all(this.szenarioAgents.map(({ brain }) => brain.kill()));
    this.szenarioAgents = [];
    this.isRunningSzenario = false;
  }
}
