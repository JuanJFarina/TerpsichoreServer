import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Length,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password is too week. Passwords will contain at least 1 upper case letter, 1 lower case letter and 1 number or special character',
  })
  password: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty()
  @IsString()
  @Length(2, 100)
  lastName: string;

  @ApiProperty()
  @IsString()
  phone: string;
}
