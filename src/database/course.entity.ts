import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinTable,
  OneToMany,
  ManyToMany,
} from 'typeorm';

import { Category } from './category.entity';
import { CourseClass } from './class.entity';

@Entity({ name: 'course', schema: 'public' })
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', {
    name: 'title',
    length: 50,
    nullable: false,
    unique: true,
  })
  title: string;

  @Column('character varying', {
    name: 'description',
    length: 250,
    nullable: true,
  })
  description: string;

  @Column('character varying', {
    name: 'instructor',
    length: 50,
    nullable: true,
  })
  instructor: string;

  @OneToMany(() => CourseClass, (courseClass) => courseClass.course)
  classes: CourseClass[];

  @ManyToMany(() => Category, (category) => category.courses)
  @JoinTable({
    name: 'course_category',
  })
  categories: Category[];

  constructor(partial: Partial<Course>) {
    Object.assign(this, partial);
  }
}
