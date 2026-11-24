import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { PetStatus } from '../enums/pet_status.enum';

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  breed!: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  age!: number;

  @IsString()
  @IsNotEmpty()
  gender!: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsEnum(PetStatus)
  status?: PetStatus;
}
