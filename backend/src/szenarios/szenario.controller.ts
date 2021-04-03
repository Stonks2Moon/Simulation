import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SzenarioService } from './szenario.service';

@Controller('szenarios')
export class SzenarioController {
  constructor(private readonly szenarioService: SzenarioService) {}

  @Get(':szenarioId')
  public runSzenario(@Param('szenarioId', ParseIntPipe) szenarioId: number) {
    return this.szenarioService.runSzenario(szenarioId);
  }

  @Get()
  public getAvailable() {
    return this.szenarioService.get();
  }

  @Get(':id')
  public get(@Param('id', ParseIntPipe) id: number) {
    return this.szenarioService.get(id);
  }
}
