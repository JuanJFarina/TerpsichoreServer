import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Progress_Tracking } from './class_progress_tracking.entity';

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

  @OneToMany(() => Progress_Tracking, (userClasses) => userClasses.clase)
  userClasses: Progress_Tracking[];

  constructor(partial: Partial<CourseClass>) {
    Object.assign(this, partial);
  }
}
