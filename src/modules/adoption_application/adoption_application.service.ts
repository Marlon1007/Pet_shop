import { Injectable } from '@nestjs/common';
import { CreateAdoptionApplicationDto } from './dto/create-adoption_application.dto';
import { UpdateAdoptionApplicationDto } from './dto/update-adoption_application.dto';

@Injectable()
export class AdoptionApplicationService {
  create(createAdoptionApplicationDto: CreateAdoptionApplicationDto) {
    return 'This action adds a new adoptionApplication';
  }

  findAll() {
    return `This action returns all adoptionApplication`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adoptionApplication`;
  }

  update(id: number, updateAdoptionApplicationDto: UpdateAdoptionApplicationDto) {
    return `This action updates a #${id} adoptionApplication`;
  }

  remove(id: number) {
    return `This action removes a #${id} adoptionApplication`;
  }
}
