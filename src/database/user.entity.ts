import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { CourseClass } from './classes.entity';

@Entity({ name: 'user', schema: 'public' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', {
    name: 'email',
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column('character varying', {
    name: 'password',
    length: 100,
    nullable: true,
  })
  password: string;

  @Column('character varying', {
    name: 'name',
    length: 50,
    nullable: true,
  })
  name: string;

  @Column('character varying', {
    name: 'lastname',
    length: 50,
    nullable: true,
  })
  lastName: string;

  @Column('character varying', {
    name: 'phone',
    length: 26,
    nullable: true,
  })
  phone: string;

  @Column('boolean', {
    name: 'verified',
    default: false,
  })
  verified: boolean;

  @Column('boolean', {
    name: 'deleted',
    default: false,
  })
  deleted: boolean;

  @Exclude()
  @CreateDateColumn({
    type: 'timestamptz',
    name: 'createdAt',
    default: () => `now()`,
    onUpdate: `now()`,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updatedAt',
    default: () => `now()`,
    onUpdate: `now()`,
  })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({
    type: 'timestamptz',
    name: 'deletedAt',
    onUpdate: `now()`,
  })
  deletedAt?: Date;

  @ManyToMany(() => CourseClass, (clase) => clase.id)
  clase: CourseClass[];
  
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
