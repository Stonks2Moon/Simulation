import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
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

  @Get('status')
  @ApiResponse({
    status: 200,
    type: Number,
  })
  @ApiOperation({
    description:
      'Gets the execution state of a szenario in percent. 100 means its a the szenario is finished',
  })
  public async getSzenarioProgress() {
    return this.szenarioService.getSzenarioProgress();
  }

  @Post()
  @ApiBody({
    type: SzenarioStartDto,
    description: 'Szenario description',
  })
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Szenario started' })
  @ApiUnauthorizedResponse({ description: 'Missing token' })
  @ApiOperation({ description: 'Starts a szenario' })
  public runSzenario(
    @Body() szenarioDto: SzenarioStartDto,
    @Headers('Authorization') auth: string,
  ) {
    if (!auth) throw new UnauthorizedException();
    return this.szenarioService.runSzenario(szenarioDto, auth);
  }

  @Post('/stop')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Szenario stopped' })
  @ApiOperation({ description: 'Stop the current szenario' })
  public stopCurrentSzenario() {
    return this.szenarioService.stopCurrentSzenario();
  }
}
