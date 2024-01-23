import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, In } from 'typeorm';
import { Course } from 'src/database/course.entity';
import { CourseDto } from './dto/course-dto';
import { Category } from 'src/database/category.entity';
import UpdateCourseDto from './dto/update-course.dto';
import { Progress_Tracking } from 'src/database/class_progress_tracking.entity';
import { CourseClass } from 'src/database/class.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

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
      throw new HttpException('Error at creating course', HttpStatus.BAD_REQUEST);
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
  async droppOutCourse(userId: string, courseId: string): Promise<void> {
    try {
      await this.courseRepository.query(`
        DELETE FROM progress_tracking
        WHERE user_id = '${userId}' AND class_id IN (
          SELECT id
          FROM "class"
          WHERE course_id = '${courseId}'
        );
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

  async getCourseOfUser(userId: string): Promise<any[]> {
    return await this.courseRepository.query(
      `
      SELECT
        cs.*,
        COALESCE(
          TRUNC(
            (COUNT(pt.id) FILTER (WHERE pt.completed = true) * 100.0) / COUNT(pt.id),
            0
          ),
          0
        ) AS progress,
        COUNT(pt.id) AS total_classes,
        COUNT(pt.id) FILTER (WHERE pt.completed = true) AS total_completed
      FROM
        "course" AS cs
        LEFT JOIN "class" AS cl ON cs.id = cl.course_id
        LEFT JOIN progress_tracking AS pt ON cl.id = pt.class_id
      WHERE
        pt.user_id = $1
      GROUP BY
        cs.id;
    `,
      [userId],
    );
  }

  async remove(id: string): Promise<void> {
    await this.courseRepository.delete(id);
  }

  async addCategoriesToCourse(courseId: string, categoriesId: string[]) {
    try {
      const categoriesValues = categoriesId
        .map((categoryId) => `('${courseId}', '${categoryId}')`)
        .join(',');

      await this.courseRepository.query(`
        INSERT INTO course_category ("courseId", "categoryId")
        VALUES ${categoriesValues};
      `);
    } catch (error) {
      throw new HttpException(
        'El curso ya tiene una de las categorias seleccioandas',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteCategoriesToCourse(courseId: string, categoriesId: string[]) {
    try {
      const categoriesValues = categoriesId
        .map((categoryId) => `('${courseId}', '${categoryId}')`)
        .join(',');

      await this.courseRepository.query(`
        DELETE FROM course_category
        WHERE ("courseId", "categoryId") IN (${categoriesValues});
      `);
    } catch (error) {
      throw new HttpException(
        'Una de las categorias no pertenece al curso',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByCategory(categoryId: string) : Promise<Course[]> {
    try {
      const courses = await this.courseRepository.query(`
      SELECT course.*
      FROM course
      INNER JOIN course_category ON course.id = course_category."courseId"
      WHERE course_category."categoryId" = $1
      `, [categoryId]);
      return courses;
    } catch (error) {
      throw new HttpException(
        'Error al filtrar cursos por categoria',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async findByName(name: string) : Promise<Course[]>{
    try{
      const courses = await this.courseRepository.query(`
      SELECT course.*
      FROM course
      WHERE course.title ILIKE $1
      `, [`%${name}%`])
      return courses;
    } catch(error){
      throw new HttpException(
        'Error al filtrar los cursos',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async findClassByCourseId(courseId: string): Promise<CourseClass[]>{
    try{
      const classes = await this.courseRepository.query(`
        SELECT class.*
        FROM class
        WHERE class."courseId" = $1
      `,[courseId]);
      return classes;
    }catch(error){
      throw new HttpException(
        'Error al filtrar clases',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
