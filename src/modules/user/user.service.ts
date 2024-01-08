import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user-dto';
import * as bcrypt from 'bcrypt';
import { TokenTypes } from 'src/common/enums/token-types.enum';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterUserDto) {
    const { email } = payload;
    const verifiedUserWithEmail = await this.userRepository.findOne({
      where: {
        email: email.toLowerCase().trim(),
      },
    });
    if (verifiedUserWithEmail) {
      throw new HttpException('Email alredy register', HttpStatus.BAD_REQUEST);
    }

    const password = await bcrypt.hash(payload.password, 10);
    const createdUser = this.userRepository.create({
      ...payload,
      password,
    });
    const jwtPayload: any = {
      type: TokenTypes.ACCESS,
      email: createdUser.email,
      id: createdUser.id,
    };

    const credential = {
      access_token: this.jwtService.sign(jwtPayload),
      refresh_token: this.jwtService.sign({
        ...jwtPayload,
        type: TokenTypes.REFRESH,
        expireIn: process.env.JWT_EXPIRATION_TIME,
      }),
    };

    await this.userRepository.save(createdUser);
    return {
      profile: createdUser,
      credential,
    };
  }
}
