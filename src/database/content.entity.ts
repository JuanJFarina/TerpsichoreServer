import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { CourseClass } from './class.entity';
import { ContentTypeEnum } from 'src/common/enums/content-type.enum';

@Entity({ name: 'content', schema: 'public' })
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CourseClass, (courseClass) => courseClass.contents)
  @JoinColumn({ name: 'class_id' })
  course_Class: CourseClass;

  @Column('enum', {
    name: 'content-type',
    enum: ContentTypeEnum,
    nullable: false,
  })
  content_type: ContentTypeEnum;

  @Column('character varying', {
    name: 'URL',
    length: 250,
    nullable: true,
  })
  URL: string;

  constructor(partial: Partial<Content>) {
    Object.assign(this, partial);
  }
}
