import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';
import { User } from '../interfaces/user.interface';

export class LoginAuthDto implements User {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @MinLength(6)
  @MaxLength(20)
  @IsNotEmpty()
  password!: string;
}
