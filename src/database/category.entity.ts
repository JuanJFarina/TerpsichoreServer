import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinTable,
    ManyToOne,
    ManyToMany
} from 'typeorm';

import { Course } from './courses.entity';

@Entity({ name: 'category', schema: 'public' })
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('character varying', {
        name: 'category',
        length: 50,
        nullable: false,
        unique: true,
    })
    category: string;

    @ManyToMany(() => Course, course => course.categories)
    courses: Course[];

    constructor(partial: Partial<Category>) {
        Object.assign(this, partial);
    }
}
