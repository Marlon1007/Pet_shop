import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pet } from "../../pet/entities/pet.entity";
import { Applicant } from "../../applicant/entities/applicant.entity";
import { ApplicationStatus } from "../enums/adoption_app_status.enum";

@Entity()
export class AdoptionApplication {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.PENDING
    })
    status!: ApplicationStatus; 

    @CreateDateColumn()
    createdAt!: Date;

    // Relación: Muchas solicitudes pertenecen a una sola mascota
    @ManyToOne(() => Pet, { onDelete: 'CASCADE' })
    pet!: Pet;

    // Relation: Many applications belong to one applicant
    @ManyToOne(() => Applicant, (applicant) => applicant.applications)
    applicant!: Applicant;
}