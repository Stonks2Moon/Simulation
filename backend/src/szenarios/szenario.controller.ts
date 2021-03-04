import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SzenarioService } from './szenario.service';

@Controller('szenarios')
export class SzenarioController {
  constructor(private readonly szenarioService: SzenarioService) {}

  @Get(':szenarioId')
  public loadSzenario(@Param('szenarioId', ParseIntPipe) szenarioId: number) {
    return this.szenarioService.getSzenario(szenarioId);
  }
}
