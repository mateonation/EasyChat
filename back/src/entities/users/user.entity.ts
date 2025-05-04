import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Role } from "./role/role";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column()
    registerDate: Date;

    @ManyToMany(() => Role, (role) => role.users, { cascade: true })
    @JoinTable()
    roles: Role[];
}