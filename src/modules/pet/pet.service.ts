import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Repository } from 'typeorm';
import { Pet } from './entities/pet.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PetService {
  constructor(@InjectRepository(Pet) private petRepository: Repository<Pet>) {}

  queryBuilder(alias: string) {
    return this.petRepository.createQueryBuilder(alias);
  }

  async create(createPetDto: CreatePetDto): Promise<Pet> {
    const { breed, ...petData } = createPetDto;
    const newPet = this.petRepository.create({ ...petData, breed: { id: breed } });
    return await this.petRepository.save(newPet);
  }

  async findAll(): Promise<Pet[]> {
    return await this.petRepository.find();
  }

  async findOne(id: number): Promise<Pet> {
    const pet = await this.petRepository.findOne({ where: { id } });
    if (!pet) {
      throw new Error(`Pet with ID ${id} not found.`);
    }
    return pet;
  }

  async update(id: number, updatePetDto: UpdatePetDto): Promise<Pet> {
    const { breed, ...petData } = updatePetDto;
    await this.petRepository.update(id, {
      ...petData,
      breed: breed === undefined ? undefined : { id: breed },
    });
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.petRepository.delete(id);
    return {
      success: true,
      message: `Pet with ID ${id} was successfully deleted.`
    };
  }
}
