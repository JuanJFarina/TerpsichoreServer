import {
  Controller,
  ClassSerializerInterceptor,
  Get,
  Post,
  HttpException,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login-dto';
import { GenericResponse } from 'src/common/dto/generic-response';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { JwtPayload } from 'src/common/interface/jwt-payload.interface';
import { User } from 'src/database/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary:
      'The username and the password are received, it is validated, and the access token is sent',
  })
  @ApiBody({
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'JwtPayload data transfer object',
  })
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async login(@Req() req: Request & { user: User }) {
    try {
      const result = await this.authService.login(req.user);
      return new GenericResponse({
        code: HttpStatus.OK,
        message: 'Welcome',
        result,
      });
    } catch (ex: any) {
      throw new HttpException(ex.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getProfile(@Req() req: Request & { user: JwtPayload }) {
    try {
      const result = await this.authService.getProfile(req.user.id);
      return new GenericResponse({
        code: HttpStatus.OK,
        message: 'profile',
        result,
      });
    } catch (ex: any) {
      throw new HttpException(ex.message, HttpStatus.BAD_REQUEST);
    }
  }
}
