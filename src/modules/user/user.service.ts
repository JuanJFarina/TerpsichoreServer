import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user-dto';
import * as bcrypt from 'bcryptjs';
import { TokenTypes } from 'src/common/enums/token-types.enum';
import { JwtService } from '@nestjs/jwt';
import { IGooglePayload } from 'src/common/interface/auth-google-payload.interface';
import { ICredentials } from 'src/common/interface/credential-interface';
import { JwtPayload } from 'src/common/interface/jwt-payload.interface';
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
    const createdUser = await this.userRepository.save({
      ...payload,
      password,
    });


    const credential = await this.genericAuthResponse(createdUser);

    return {
      profile: createdUser,
      credential,
    };
  }


  async genericAuthResponse(user: Partial<User>): Promise<ICredentials> {

    const jwtPayload: JwtPayload = {
      type: TokenTypes.ACCESS,
      email: user.email,
      id: user.id,
    };

    return {
      access_token: this.jwtService.sign(jwtPayload),
      refresh_token: this.jwtService.sign({
        ...jwtPayload,
        type: TokenTypes.REFRESH,
        expireIn: process.env.JWT_EXPIRATION_TIME,
      }),
    };

  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        email: email.toLowerCase().trim(),
      }
    });
  }

  async authGoogle(userPayload:IGooglePayload): Promise<string> {
    const {email} = userPayload;
    try{
      let user = await this.getUserByEmail(email)
      if (!user){
        user = await this.userRepository.create({...userPayload, verified:true});
        await this.userRepository.save(user);
      }

      const credential = await this.genericAuthResponse(user);

      return credential.access_token;
    }catch(error){
      throw new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.BAD_REQUEST,
      ) 
    }
  }
}
