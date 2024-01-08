import { registerAs } from '@nestjs/config';
import { User } from 'src/database/user.entity';
import { CourseClass } from 'src/database/class.entity';
import { Course } from 'src/database/course.entity';
import { Category } from 'src/database/category.entity';
import { Progress_Tracking } from 'src/database/class_progress_tracking.entity';

export default registerAs('database', () => ({
  type: process.env.POSTGRES_TYPE,
  host: process.env.POSTGRES_HOST,
  schema: process.env.POSTGRES_SHEMA,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [User, CourseClass, Course, Progress_Tracking, Category],
  synchronize: true,
  logging: false,
  dropSchema: false,
}));
