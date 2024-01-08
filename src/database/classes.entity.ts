import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm';

import { Progress_Tracking } from './classes_progress_tracking.entity';

@Entity({name: 'classes', schema: 'public'})
export class CourseClass{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'order',
        type: 'int',
        nullable: false,
        unique: true
    })
    order: number;

    @Column('character varying',{
        name: 'title',
        length: 50,
        nullable: false,
        unique: true,
    })
    title: string;

    @Column('character varying',{
        name: 'description',
        length: 100,
        nullable: false,
        unique: true,
    })
    description: string;

    @OneToMany(()=> Progress_Tracking, (userClasses) => userClasses.clase)
    userClasses: Progress_Tracking[];
    
    constructor(partial: Partial<CourseClass>) {
        Object.assign(this, partial);
    }
}