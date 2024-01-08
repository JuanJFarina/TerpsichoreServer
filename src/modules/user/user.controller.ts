import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GenericResponse } from 'src/common/dto/generic-response';
import { ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user-dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() payload: RegisterUserDto) {
    try {
      const result = await this.userService.register(payload);
      return new GenericResponse({
        code: 201,
        message: 'Registration successful',
        result,
      });
    } catch (ex) {
      throw new HttpException(
        ex.message || 'internal Server Error',
        ex.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
