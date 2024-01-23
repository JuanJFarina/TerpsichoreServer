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
  Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenericResponse } from 'src/common/dto/generic-response';
import { CourseDto } from './dto/course-dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import AddCategoriesDto from './dto/add-categories.dto';

/*
TODO: 

3. crear una paginacion en todos los GET mencionados.

5. ir al modulo de clases y crear un endpoint para crear clases en el curso

6. completar el crud de clases 

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
  @Get('by-id/:id')
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

  @ApiOperation({ summary: 'Eliminar un curso' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<GenericResponse> {
    try {
      const result = await this.courseService.remove(id);
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Inscribirme un curso' })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Darse de baja de un curso' })
  @UseGuards(JwtAuthGuard)
  @Delete('dropp-out/:courseId')
  async droppOutCourse(@Param('courseId') courseId: string, @Req() req) {
    try {
      const result = await this.courseService.droppOutCourse(
        req.user.id,
        courseId,
      );
      return new GenericResponse({
        code: 202,
        message: 'enroll successful',
        result,
      });
    } catch (ex: any) {
      throw new HttpException(ex.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'obtener mis cursos' })
  @UseGuards(JwtAuthGuard)
  @Get('my-courses')
  async getCourseOfUser(@Req() req) {
    try {
      const result = await this.courseService.getCourseOfUser(req.user.id);
      return new GenericResponse({
        code: 200,
        message: 'enroll successful',
        result,
      });
    } catch (ex: any) {
      throw new HttpException(ex.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'agregar categorias a un curso' })
  @Put('add-categories/:courseId')
  async addCategory(
    @Param('courseId') courseId: string,
    @Body() addCategoriesDto: AddCategoriesDto,
  ) {
    try {
      const result = await this.courseService.addCategoriesToCourse(
        courseId,
        addCategoriesDto.categories,
      );

      return new GenericResponse({
        result,
        code: 200,
        message: 'added category successfully',
      });
    } catch (ex: any) {
      throw new HttpException(
        ex.message || 'internal error',
        ex.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({summary:'Filtrar cursos por categoria'})
  @Get('by-Category/:categoryId')
  async findByCategory(@Param('categoryId') categoryId: string){
    try{
      const result = await this.courseService.findByCategory(categoryId);
      return new GenericResponse({
        result,
        code: 200,
      });
    } catch (ex: unknown) {
      throw new HttpException(
        ex instanceof Error ? ex.message : 'Internal server error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({summary: 'Obtener curso por nombre'})
  @Get('by-name')
  async findByName(@Query('name') name: string){
    try{
      const result = await this.courseService.findByName(name)
      return new GenericResponse({
        result,
        code: 200,
      });
    }catch(ex: unknown){
      ex instanceof Error ? ex.message: 'Internal server error', 
      HttpStatus.BAD_REQUEST
    };
  }

  @ApiOperation({ summary: 'Obtener las clases de un curso por Id' })
@Get(':courseId/classes')
async findClasesByCursoId(@Param('cursoId') courseId: string) {
  try {
    const result = await this.courseService.findClassByCourseId(courseId);
    return new GenericResponse({
      result,
      code: 200,
    });
  } catch (ex: unknown) {
    throw new HttpException(
      ex instanceof Error ? ex.message : 'Internal server error',
      HttpStatus.BAD_REQUEST,
    );
  }
}
}
