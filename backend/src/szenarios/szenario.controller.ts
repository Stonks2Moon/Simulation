import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Szenario, SzenarioService } from './szenario.service';
import { SzenarioStartDto } from './szenarioStart.dto';

@Controller('szenarios')
export class SzenarioController {
  constructor(private readonly szenarioService: SzenarioService) {}

  @Get()
  @ApiOperation({
    description: 'Returns all available szenarios',
  })
  @ApiResponse({
    status: 200,
    type: [Szenario],
  })
  public getAvailable() {
    return this.szenarioService.get();
  }

  @Post()
  @ApiBody({
    type: SzenarioStartDto,
    description: 'Szenario description',
  })
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Szenario Started' })
  @ApiUnauthorizedResponse({ description: 'Missing token' })
  @ApiOperation({ description: 'Starts a szenario' })
  public runSzenario(
    @Body() szenarioDto: SzenarioStartDto,
    @Headers('Authorization') auth: string,
  ) {
    if (!auth) throw new UnauthorizedException(); // TODO:
    return this.szenarioService.runSzenario(szenarioDto, auth);
  }
}
