import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult} from 'typeorm';
import { CourseClass } from "src/database/class.entity";

@Injectable()
export class ClassService {
    constructor (
        @InjectRepository(CourseClass)
        private readonly classRepository: Repository<CourseClass>,
    ) {}

    async findAll(): Promise<CourseClass[]> {
        return this.classRepository.find();
    }

    async findOne(id: string): Promise<CourseClass | undefined> {
        try {
            return await this.classRepository.findOneOrFail({ where: { id } });
        } catch (error) {
            return undefined;
        }
    }

                    //TODO: create dto
    async create(categoryDto: any): Promise<CourseClass> {
        return this.classRepository.save(categoryDto);
    }
                           //TODO: create dto
    async update(id: string, categoryDto: any): Promise<UpdateResult | undefined> {
        try {
        return await this.classRepository.update(id, categoryDto);
        } catch (error) {
            return undefined;
        }
    }

    async remove(id: string): Promise<void> {
        await this.classRepository.delete(id);
    }
}
