import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Repository } from 'typeorm';
import { Pet } from './entities/pet.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PetService {
  constructor(@InjectRepository(Pet) private petRepository: Repository<Pet>) {}

  async create(createPetDto: CreatePetDto): Promise<Pet> {
    const newPet = this.petRepository.create(createPetDto);
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
    await this.petRepository.update(id, updatePetDto);
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
