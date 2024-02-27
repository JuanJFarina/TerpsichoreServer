import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ContentTypeEnum } from 'src/common/enums/content-type.enum';

export class ContentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  URL: string;

  @ApiProperty()
  @IsEnum(ContentTypeEnum)
  @IsNotEmpty()
  content_type: ContentTypeEnum;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  course_class: string;
}

export default ContentDto;
