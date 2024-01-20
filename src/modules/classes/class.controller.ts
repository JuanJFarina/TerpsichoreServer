import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('clases')
@Controller('class')
export class ClassController {
  constructor() {}

  @Get('/')
  getAllClass() {}
}
