import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from 'src/database/content.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ContentDto } from './dto/content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { CourseClass } from 'src/database/class.entity';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,

    @InjectRepository(CourseClass)
    private readonly courseClassRepository: Repository<CourseClass>,
  ) {}

  async findAll(): Promise<Content[]> {
    try {
      return await this.contentRepository.find();
    } catch (error) {
      throw new HttpException('INTERNAL SERVER RROR', HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string): Promise<Content | undefined> {
    try {
      return await this.contentRepository.findOne({ where: { id } });
    } catch (error) {
      throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.BAD_REQUEST);
    }
  }

  async create(contentDto: ContentDto): Promise<Content> {
    try {
      const content = this.contentRepository.create(contentDto);
      return this.contentRepository.save(content);
    } catch (error) {
      throw new HttpException(
        'Error at creating content',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: string,
    updateContentDto: UpdateContentDto,
  ): Promise<UpdateResult | undefined> {
    try {
      return await this.contentRepository.update(id, updateContentDto);
    } catch (error) {
      throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.contentRepository.delete(id);
    } catch (error) {
      throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.BAD_REQUEST);
    }
  }
}
