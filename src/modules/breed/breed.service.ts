import { Inject, Injectable } from '@nestjs/common';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { Breed } from './entities/breed.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BreedService {

  constructor(@Inject('BREED_REPOSITORY') private breedRepository:Repository<Breed>) {}
  create(createBreedDto: CreateBreedDto) {
    return 'This action adds a new breed';
  }

  async findAll() {
    return await this.breedRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} breed`;
  }

  update(id: number, updateBreedDto: UpdateBreedDto) {
    return `This action updates a #${id} breed`;
  }

  remove(id: number) {
    return `This action removes a #${id} breed`;
  }
}
