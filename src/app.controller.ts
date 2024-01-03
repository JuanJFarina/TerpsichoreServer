import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GenericResponse } from './common/dto/generic-response';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): GenericResponse {
    return new GenericResponse({
      result: this.appService.getHello(),
      code: 200,
      message: 'nice',
    });
  }
}
