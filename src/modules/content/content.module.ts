import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { Content } from 'src/database/content.entity';
import { CourseClass } from 'src/database/class.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Content, CourseClass])],
  providers: [ContentService],
  controllers: [ContentController],
})
export class ContentModule {}
