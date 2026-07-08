import { Injectable } from '@nestjs/common';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { Applicant } from './entities/applicant.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ApplicantService {
  constructor(@InjectRepository(Applicant) private applicantRepository: Repository<Applicant>) {}

  async create(createApplicantDto: CreateApplicantDto):Promise<Applicant> {
    const newApplicant = this.applicantRepository.create(createApplicantDto);
    return await this.applicantRepository.save(newApplicant);
  }

  async findAll():Promise<Applicant[]> {
    return await this.applicantRepository.find();
  }

  async findOne(id: number):Promise<Applicant> {
    const applicant = await this.applicantRepository.findOne({ where: { id } });
    if (!applicant) {
      throw new Error(`Applicant with ID ${id} not found.`);
    }
    return applicant;
  }

  async update(id: number, updateApplicantDto: UpdateApplicantDto):Promise<Applicant> {
    await this.applicantRepository.update(id, updateApplicantDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.applicantRepository.delete(id);
    return {
      success: true,
      message: `Applicant with ID ${id} was successfully deleted.`
    };
  }
}
