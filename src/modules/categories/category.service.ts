import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Category } from "src/database/category.entity";
import { CategoryDto } from "./dto/category-dto";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    async findOne(id: string): Promise<Category | undefined> {
        try {
            return await this.categoryRepository.findOneOrFail({ where: { id } });
        } catch (error) {
            return undefined;
        }
    }

    async create(categoryDto: CategoryDto): Promise<Category> {
        return this.categoryRepository.save(categoryDto);
    }

    async update(id: string, categoryDto: CategoryDto): Promise<UpdateResult | undefined> {
        try {
            return await this.categoryRepository.update(id, categoryDto);
        } catch (error) {
            return undefined;
        }
    }

    async remove(id: string): Promise<void> {
        await this.categoryRepository.delete(id);
    }
}
