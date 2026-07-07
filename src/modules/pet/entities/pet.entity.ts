import { Breed } from "../../breed/entities/breed.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { PetStatus } from "../enums/pet_status.enum";


@Entity()
export class Pet {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    // Relation: Many pets belong to one breed
    @ManyToOne(() => Breed, (breed) => breed.pet, { eager: true })
    breed!: Breed;

    @Column()
    age!: number;

    @Column()
    gender!: string;

    @Column()
    image!: string;

    @Column({
        type: 'enum',
        enum: PetStatus,
        default: PetStatus.AVAILABLE
    })
    status!: PetStatus;
}