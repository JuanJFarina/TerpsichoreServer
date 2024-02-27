import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ContentTypeEnum } from 'src/common/enums/content-type.enum';

export class UpdateContentDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  URL?: string;

  @ApiProperty({ required: false })
  @IsEnum(ContentTypeEnum)
  @IsNotEmpty()
  @IsOptional()
  content_type?: ContentTypeEnum;

  @ApiProperty({ required: false })
  @IsString({ each: true })
  @IsOptional()
  classes?: string[];
}
