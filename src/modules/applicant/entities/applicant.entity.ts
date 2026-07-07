import { AdoptionApplication } from "../../adoption_application/entities/adoption_application.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Applicant {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    phone!: string;

    @Column()
    address!: string;

    // Relation: One applicant can have many adoption applications
    @OneToMany(() => AdoptionApplication, (app) => app.applicant)
    applications!: AdoptionApplication[];
}