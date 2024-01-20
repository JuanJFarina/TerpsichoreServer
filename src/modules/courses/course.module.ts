import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/database/course.entity';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { Category } from 'src/database/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Category])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
