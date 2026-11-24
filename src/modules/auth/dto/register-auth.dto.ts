import { LoginAuthDto } from './login-auth.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterAuthDto extends LoginAuthDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
