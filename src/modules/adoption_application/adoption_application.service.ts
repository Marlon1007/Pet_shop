import { Injectable } from '@nestjs/common';
import { CreateAdoptionApplicationDto } from './dto/create-adoption_application.dto';
import { UpdateAdoptionApplicationDto } from './dto/update-adoption_application.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AdoptionApplication } from './entities/adoption_application.entity';

@Injectable()
export class AdoptionApplicationService {

  constructor(@InjectRepository(AdoptionApplication) private adoptionApplicationRepository: Repository<AdoptionApplication>) { }

  async create(createAdoptionApplicationDto: CreateAdoptionApplicationDto): Promise<AdoptionApplication> {
    const newAdoptionApplication = new AdoptionApplication();
    newAdoptionApplication.pet = { id: createAdoptionApplicationDto.petId } as any;
    newAdoptionApplication.applicant = { id: createAdoptionApplicationDto.applicantId } as any;
    return await this.adoptionApplicationRepository.save(newAdoptionApplication);
  }

  async findAll(): Promise<AdoptionApplication[]> {
    return await this.adoptionApplicationRepository.find();
  }

  async findOne(id: number): Promise<AdoptionApplication> {
    const adoptionApplication = await this.adoptionApplicationRepository.findOne({ where: { id } });
    if (!adoptionApplication) {
      throw new Error(`Adoption application with ID ${id} not found.`);
    }
    return adoptionApplication;
  }

  async update(id: number, updateAdoptionApplicationDto: UpdateAdoptionApplicationDto): Promise<AdoptionApplication> {
    const application = await this.findOne(id);

    if (updateAdoptionApplicationDto.status) {
      application.status = updateAdoptionApplicationDto.status;
    }
    if (updateAdoptionApplicationDto.petId) {
      application.pet = { id: updateAdoptionApplicationDto.petId } as any;
    }
    if (updateAdoptionApplicationDto.applicantId) {
      application.applicant = { id: updateAdoptionApplicationDto.applicantId } as any;
    }
    return await this.adoptionApplicationRepository.save(application);
  }

  async remove(id: number) {
    await this.adoptionApplicationRepository.delete(id);
    return {
      success: true,
      message: `Adoption application with ID ${id} was successfully deleted.`
    };
  }
}
