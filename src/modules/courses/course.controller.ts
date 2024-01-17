import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { CourseService } from './course.service';
import { Course } from 'src/database/course.entity';
import {
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { GenericResponse } from 'src/common/dto/generic-response';
import {CourseDto } from './dto/course-dto';

@ApiTags('Course')
@Controller('course')
export class CourseController {
    constructor(private readonly courseService: CourseService) { }

    @ApiOperation({ summary: 'Obtener todos los cursos' })
    @Get()
    async findAll(): Promise<Course[]> {
        return this.courseService.findAll();
    }

    @ApiOperation({ summary: 'Obtener curso por ID' })
    @Get(':id')
    findOne(@Param('id') id: string): Promise<Course> {
        return this.courseService.findOne(id);
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
            })
        } catch (ex) {
            throw new HttpException(
                ex.message || '',
                ex.status || HttpStatus.BAD_REQUEST
            )
        }
    }

    @ApiOperation({ summary: 'Editar un curso' })
    @Put(':id')
    update(@Param('id') id: string, @Body() courseDto: CourseDto){
        try {
            const result = this.courseService.update(id, courseDto);
            return new GenericResponse({
                code: 200,
                message: 'Update successful',
                result
            })
        } catch(ex: unknown){
            throw new HttpException(ex instanceof Error? ex.message: 'Internal server error', HttpStatus.BAD_REQUEST);
        }
        return 
    }

    @ApiOperation({ summary: 'Eliminar un curso' })
    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.courseService.remove(id);
    }
}