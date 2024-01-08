import{
    Entity,
    ManyToOne,
    JoinColumn,
    Column,
    PrimaryGeneratedColumn
} from 'typeorm'

import { CourseClass } from './classes.entity';
import { User } from './user.entity';

@Entity({name:'progress_tracking', schema: 'public'})
export class Progress_Tracking{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(()=> User, (user) => user.clase)
    @JoinColumn({name: 'user_id'})
    user: User;

    @ManyToOne(()=> CourseClass, (clase) => clase.id)
    @JoinColumn({name: 'class_id'})
    clase: CourseClass;

    @Column('boolean',{
        name: 'completed',
        default: false
    })
    completed: boolean;

    constructor(partial: Partial<Progress_Tracking>) {
        Object.assign(this, partial);
    }
}