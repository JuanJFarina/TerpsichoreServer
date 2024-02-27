import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Progress_Tracking } from './class_progress_tracking.entity';
import { Course } from './course.entity';
import { Content } from './content.entity';

@Entity({ name: 'class', schema: 'public' })
export class CourseClass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'order',
    type: 'int',
    nullable: false,
  })
  order: number;

  @Column('character varying', {
    name: 'title',
    length: 100,
    nullable: false,
  })
  title: string;

  @Column('character varying', {
    name: 'description',
    length: 300,
    nullable: false,
  })
  description: string;

  @ManyToOne(() => Course, (course) => course.classes)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @OneToMany(() => Content, (content) => content.course_Class)
  contents: Content[];

  @OneToMany(() => Progress_Tracking, (userClasses) => userClasses.clase)
  userClasses: Progress_Tracking[];

  constructor(partial: Partial<CourseClass>) {
    Object.assign(this, partial);
  }
}
