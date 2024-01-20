import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenericResponse } from 'src/common/dto/generic-response';
import { CourseDto } from './dto/course-dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

/*
TODO: 
1. crear un endpoint para agregarle categorias a un curso.
- este debe de ser un PUT que reciba como body un array de UID de categoria.
- crear la relacion entre esas categorias y el curso.

2. crear un endpoint para eliminar categorias de un curso.
- este debe de ser un PUT que reciba como body un array de UID de categoria.
- eliminar la relacion entre esas categorias y el curso.


3. crear un endpoint para buscar cursos por categoria.
- este debe de ser un GET que reciba como query un UID de categoria.
- buscar los cursos que tengan esa categoria.

4. crear un endpoint para buscar cursos por nombre. 
- este debe de ser un GET que reciba como query un nombre.
- buscar los cursos que tengan ese nombre (debe de ser por INCLUDE o LIKE).
- se pude usar una busqueda por palabra clave tambien.

5. crear una paginacion en todos los GET mencionados.

6. crear un endpoint para anotarme a un curso.
- este debe de ser un PUT que reciba como body un UID de curso.
- este endpoint debe de  buscar todas las clases de el curso.
- crear un tracking con todas las clases

7. crear un endpoint para obtener mis cursos en el clual me anote y ver mi progreso.
*/

@ApiTags('Course')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiOperation({ summary: 'Obtener todos los cursos' })
  @Get()
  async findAll(): Promise<GenericResponse> {
    try {
      const result = await this.courseService.findAll();
      return new GenericResponse({
        code: 200,
        message: 'Courses retrieved successfully',
        result,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Obtener curso por ID' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GenericResponse> {
    try {
      const result = await this.courseService.findOne(id);
      return new GenericResponse({
        code: 200,
        message: 'Courses retrieved successfully',
        result,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Crear curso' })
  @Post()
  async create(@Body() course: CourseDto) {
    try {
      const result = this.courseService.create(course);
      return new GenericResponse({
        code: 200,
        message: 'Creation succesfull',
        result,
      });
    } catch (ex) {
      throw new HttpException(
        ex.message || 'internal error',
        ex.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Editar un curso' })
  @Put(':id')
  update(@Param('id') id: string, @Body() courseDto: CourseDto) {
    try {
      const result = this.courseService.update(id, courseDto);
      return new GenericResponse({
        code: 200,
        message: 'Update successful',
        result,
      });
    } catch (ex: unknown) {
      throw new HttpException(
        ex instanceof Error ? ex.message : 'Internal server error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Editar un curso' })
  @UseGuards(JwtAuthGuard)
  @Put('enroll/:courseId')
  async enrollUser(@Param('courseId') courseId: string, @Req() req) {
    try {
      const result = await this.courseService.enrollUser(req.user.id, courseId);
      return new GenericResponse({
        code: 202,
        message: 'enroll successful',
        result,
      });
    } catch (ex: any) {
      throw new HttpException(ex.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Eliminar un curso' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<GenericResponse> {
    try {
      const result = this.courseService.remove(id);
      return new GenericResponse({
        code: 200,
        message: 'Remove successful',
        result,
      });
    } catch (ex: unknown) {
      throw new HttpException(
        ex instanceof Error ? ex.message : 'Internal server error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
