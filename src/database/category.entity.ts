import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

import { Course } from './course.entity';

@Entity({ name: 'category', schema: 'public' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', {
    name: 'name',
    length: 50,
    nullable: false,
    unique: true,
  })
  name: string;

  @ManyToMany(() => Course, (course) => course.categories)
  courses: Course[];

  constructor(partial: Partial<Category>) {
    Object.assign(this, partial);
  }
}
