import { Person } from "../../person/entities/person.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!:string;

    @Column()
    mail!:string

    @Column()
    password!:string

    @OneToOne(() => Person, person => person.user, { cascade: true })
    person!: Person;

}