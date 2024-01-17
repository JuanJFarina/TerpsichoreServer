import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Course } from "src/database/course.entity";
import { CourseDto } from "./dto/course-dto";

@Injectable()
export class CourseService {
    constructor (
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
    ) {}

    async findAll(): Promise<Course[]> {
        return this.courseRepository.find();
    }

    async findOne(id: string): Promise<Course | undefined> {
        try {
            return await this.courseRepository.findOneOrFail({where: {id}});
        } catch (error) {
            return undefined;
        }
    }

    async create(courseDto: CourseDto): Promise<Course> {
        return await this.courseRepository.save(courseDto);
    }

    async update(id: string, courseDto: CourseDto): Promise<UpdateResult | undefined> {
        try {
           return await this.courseRepository.update(id, courseDto);
        } catch (error) {
            return undefined;
        }
    }

    async remove(id: string): Promise<void> {
        await this.courseRepository.delete(id);
    }
}
