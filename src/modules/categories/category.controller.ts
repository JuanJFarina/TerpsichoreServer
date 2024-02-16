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
} from '@nestjs/common';
import { Category } from 'src/database/category.entity';
import { CategoryDto } from './dto/category-dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenericResponse } from 'src/common/dto/generic-response';
import { CategoryService } from './category.service';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Obtener todas las categorias' })
  @Get()
  async findAll(): Promise<GenericResponse> {
    try {
      const result = await this.categoryService.findAll();
      return new GenericResponse({
        result,
        code: 200,
      });
    } catch (error: any) {
      throw new HttpException(
        error?.message || 'Internal server error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Obtener categoria por ID' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @ApiOperation({ summary: 'Crear categoria' })
  @Post()
  async create(@Body() course: CategoryDto) {
    try {
      const result = await this.categoryService.create(course);
      return new GenericResponse({
        code: 200,
        message: 'Creation succesfull',
        result,
      });
    } catch (ex: unknown) {
      throw new HttpException(
        ex instanceof Error ? ex.message : 'Internal server error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({ summary: 'Editar un categoria' })
  @Put(':id')
  update(@Param('id') id: string, @Body() categoryDto: CategoryDto) {
    try {
      const result = this.categoryService.update(id, categoryDto);
      return new GenericResponse({
        code: 200,
        message: 'Update succesfull',
        result,
      });
    } catch (ex: unknown) {
      throw new HttpException(
        ex instanceof Error ? ex.message : 'Internal server error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({ summary: 'Eliminar una categoria' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.categoryService.remove(id);
  }
}
