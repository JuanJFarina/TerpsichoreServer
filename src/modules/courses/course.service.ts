import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, In } from 'typeorm';
import { Course } from 'src/database/course.entity';
import { CourseDto } from './dto/course-dto';
import { Category } from 'src/database/category.entity';
import UpdateCourseDto from './dto/update-course.dto';
import { Progress_Tracking } from 'src/database/class_progress_tracking.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Course[]> {
    return this.courseRepository.find();
  }

  async findOne(id: string): Promise<Course | undefined> {
    try {
      return await this.courseRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      return undefined;
    }
  }

  async create(courseDto: CourseDto): Promise<Course> {
    try {
      const course = new Course({
        title: courseDto.title,
        description: courseDto.description,
        instructor: courseDto.instructor,
      });

      // Aquí gestionamos las categorías
      if (courseDto.categories && courseDto.categories.length > 0) {
        const categories = await this.categoryRepository.findBy({
          id: In(courseDto.categories),
        });
        course.categories = categories;
      }

      return await this.courseRepository.save(course);
    } catch (error) {
      throw new HttpException('Error of create course', HttpStatus.BAD_REQUEST);
    }
  }

  async update(
    id: string,
    courseDto: UpdateCourseDto,
  ): Promise<UpdateResult | undefined> {
    try {
      return await this.courseRepository.update(id, courseDto);
    } catch (error) {
      return undefined;
    }
  }
  async enrollUser(userId: string, courseId: string): Promise<void> {
    try {
      const existingTrackings = await this.getProgressOfUser(userId, courseId);

      if (existingTrackings.length)
        throw new HttpException(
          'User alredy enrolled in this course',
          HttpStatus.BAD_REQUEST,
        );

      await this.courseRepository.query(`
      INSERT INTO progress_tracking (user_id, class_id, completed)
      SELECT '${userId}', id, FALSE
      FROM "class"
      WHERE course_id = '${courseId}';
      `);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getProgressOfUser(
    userId: string,
    courseId: string,
  ): Promise<Progress_Tracking[]> {
    return await this.courseRepository.query(`
      SELECT *
      FROM progress_tracking
      JOIN "class" AS cl ON progress_tracking.class_id = cl.id
      JOIN "course" as cs on cl.course_id = cs.id
      WHERE progress_tracking.user_id = '${userId}'
      AND cs."id" = '${courseId}';
      `);
  }

  async remove(id: string): Promise<void> {
    await this.courseRepository.delete(id);
  }
}
