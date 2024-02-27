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
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login-dto';
import { GenericResponse } from 'src/common/dto/generic-response';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { JwtPayload } from 'src/common/interface/jwt-payload.interface';
import { User } from 'src/database/user.entity';
import { UserService } from '../user/user.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<any> {
    return HttpStatus.OK;
  }
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginRedirect(
    @Req() req: Request & { user?: any },
    @Res() res: Response,
  ): Promise<any> {
    const token = await this.userService.authGoogle(req.user);
    return res.redirect(`${process.env.URL_FRONT}/login?token=${token}`)
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
