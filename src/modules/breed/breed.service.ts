import { Inject, Injectable } from '@nestjs/common';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { Breed } from './entities/breed.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BreedService {

  constructor(@Inject('BREED_REPOSITORY') private breedRepository:Repository<Breed>) {}
  async create(createBreedDto: CreateBreedDto): Promise<Breed> {
    return await this.breedRepository.save(createBreedDto);
  }

  async findAll(): Promise<Breed[]> {
    return await this.breedRepository.find();
  }

  async findOne(id: number): Promise<Breed> {
    const breed = await this.breedRepository.findOneBy({ id });
    if (!breed) {
      throw new Error(`Breed with ID ${id} not found.`);
    }
    return breed;
  }

  async update(id: number, updateBreedDto: UpdateBreedDto): Promise<Breed> {
    await this.breedRepository.update(id, updateBreedDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    await this.breedRepository.delete(id);
    return {
      success: true,
      message: `Breed with ID ${id} was successfully deleted.`
    };
  }

}
