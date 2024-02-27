import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from 'src/database/user.entity';
import { TokenTypes } from 'src/common/enums/token-types.enum';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from 'src/common/interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login(user: User) {
    // const user = await this.getProfile(jwtPayload.id);
    const credential = await this.authGenericResponse(user);
    return {
      profile: user,
      credential,
    };
  }

  async authGenericResponse(user: User | JwtPayload) {
    return {
      access_token: this.generateToken(user, TokenTypes.ACCESS),
      refresh_token: this.generateToken(user, TokenTypes.REFRESH, {
        expiresIn: this.config.get('JWT_EXPIRATION_TIME_REFRESH'),
      }),
    
    };
  }

  async getProfile(id: string) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  private generateToken(
    user: User | JwtPayload,
    type: TokenTypes,
    config?: {
      secret?: string;
      expiresIn?: string;
    },
  ) {
    const commonPayload: JwtPayload = {
      type: type,
      email: user.email,
      id: user.id,
    };

    const options: JwtSignOptions = {
      expiresIn: config?.expiresIn || this.config.get('JWT_EXPIRATION_TIME'),
      secret: config?.secret || this.config.get('JWT_SECRET'),
    };

    return this.jwtService.sign(commonPayload, options);
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      throw new HttpException('Credenciales inválidas', HttpStatus.BAD_REQUEST);
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new HttpException('Credenciales inválidas', HttpStatus.BAD_REQUEST);
    }

    delete user.password;
    return user;
  }
}
