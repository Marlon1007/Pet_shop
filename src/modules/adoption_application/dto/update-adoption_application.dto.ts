import { PartialType } from '@nestjs/mapped-types';
import { CreateAdoptionApplicationDto } from './create-adoption_application.dto';

export class UpdateAdoptionApplicationDto extends PartialType(CreateAdoptionApplicationDto) {}
