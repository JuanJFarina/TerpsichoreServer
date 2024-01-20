import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class AddCategoriesDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  categories: string[];
}

export default AddCategoriesDto;
