import { ApiProperty } from "@nestjs/swagger";
import { Category } from "src/database/category.entity";
import {
    IsNotEmpty,
    IsString,
    IsArray
} from 'class-validator';

export class CourseDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    instructor: string;

    @ApiProperty({type: () => [Category]})
    @IsArray()
    @IsNotEmpty()
    categories: Category[];
}

export default CourseDto;