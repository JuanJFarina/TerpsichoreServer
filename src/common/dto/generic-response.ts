import { ApiProperty } from '@nestjs/swagger';

export class GenericResponse {
  public constructor(init?: Partial<GenericResponse>) {
    Object.assign(this, init);
  }

  @ApiProperty()
  code: number;
  @ApiProperty()
  error?: string;
  @ApiProperty()
  message: string;
  @ApiProperty()
  result?: any;
}
