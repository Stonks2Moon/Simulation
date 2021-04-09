import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { SzenarioService } from './szenario.service';
import { SzenarioStartDto } from './szenarioStart.dto';

@Controller('szenarios')
export class SzenarioController {
  constructor(private readonly szenarioService: SzenarioService) {}

  @Get()
  public getAvailable() {
    return this.szenarioService.get();
  }

  @Get(':id')
  public get(@Param('id', ParseIntPipe) id: number) {
    return this.szenarioService.get(id);
  }

  @Post()
  public runSzenario(
    @Body() szenarioDto: SzenarioStartDto,
    @Headers('Authorization') auth: string,
  ) {
    if (!auth) throw new UnauthorizedException(); // TODO:
    return this.szenarioService.runSzenario(szenarioDto);
  }
}
