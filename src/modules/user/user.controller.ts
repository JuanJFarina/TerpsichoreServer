import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { GenericResponse } from 'src/common/dto/generic-response';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async init() {
    const result = await this.userService.init();
    return new GenericResponse({
      result,
      code: 200,
    });
  }
}
