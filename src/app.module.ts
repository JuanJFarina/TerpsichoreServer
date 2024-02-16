import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataBaseConfigModule } from './config/database/config.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { CourseModule } from './modules/courses/course.module';
import { ClassModule } from './modules/classes/class.module';
import { CategoryModule } from './modules/categories/category.module';
import { QueueModule } from './common/services/queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
      global: true,
    }),
    QueueModule,
    DataBaseConfigModule,
    UserModule,
    AuthModule,
    CourseModule,
    ClassModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService, JwtModule],
})
export class AppModule {}
