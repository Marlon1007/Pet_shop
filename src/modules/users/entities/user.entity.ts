import { Person } from "../../person/entities/person.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "varchar", length: 100})
    name!:string;

    @Column({type: "varchar", length: 100, unique: true})
    email!:string

    @Column({type: "varchar", length: 100})
    password!:string

    @OneToOne(() => Person, person => person.user, { cascade: true })
    person!: Person;

}