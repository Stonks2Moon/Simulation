import { ApiProperty } from '@nestjs/swagger';

export class SzenarioStartDto {
  @ApiProperty({
    description: 'The id of the szenario to executed',
  })
  szenario: number;

  @ApiProperty({
    description: 'The stock id on which to execute the szenario',
  })
  stock: string;

  @ApiProperty({
    description: 'How fast the szenario should be executed',
  })
  speedMultiplicator: number;

  @ApiProperty({
    description: 'Which message should be sent into the news channel',
  })
  message: string;
}
