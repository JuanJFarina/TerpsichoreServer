import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GenericResponse } from './common/dto/generic-response';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): GenericResponse {
    const result = this.appService.getHello();
    return new GenericResponse({
      code: 200,
      result,
      message: 'nice',
    });
  }
}
