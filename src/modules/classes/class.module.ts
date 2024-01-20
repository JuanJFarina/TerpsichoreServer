import { Module } from '@nestjs/common';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseClass } from 'src/database/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseClass])],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}
