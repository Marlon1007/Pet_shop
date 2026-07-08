import { ApplicationStatus } from '../enums/adoption_app_status.enum';

export class UpdateAdoptionApplicationDto {
    petId?: number;
    applicantId?: number;
    status?: ApplicationStatus; 
}