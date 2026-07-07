import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Pet } from "../../pet/entities/pet.entity";

@Entity()
export class Breed {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    // Relation: One breed can have many pets
    @OneToMany(() => Pet, (pet) => pet.breed)
    pet!: Pet[];
}