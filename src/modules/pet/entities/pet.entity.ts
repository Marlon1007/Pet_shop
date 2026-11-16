import { Breed } from "../../breed/entities/breed.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { PetStatus } from "../enums/pet_status.enum";


@Entity()
export class Pet {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "varchar", length: 100})
    name!: string;

    // Relation: Many pets belong to one breed
    @ManyToOne(() => Breed, (breed) => breed.pet, { eager: true })
    breed!: Breed;

    @Column({type: "int"})
    age!: number;

    @Column({type: "varchar", length: 100})
    gender!: string;

    @Column({type: "varchar", length: 255, nullable: true})
    image!: string;

    @Column({
        type: 'enum',
        enum: PetStatus,
        default: PetStatus.AVAILABLE
    })
    status!: PetStatus;
}