import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/database/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalStrategy } from './stratergy/local.strategy';
import { JwtStrategy } from './stratergy/jwt.strategy';
import { GoogleStrategy } from './stratergy/google.strategy';

@Module({
  imports: [ConfigModule, UserModule, TypeOrmModule.forFeature([User])],

  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
