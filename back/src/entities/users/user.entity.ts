import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, CreateDateColumn } from "typeorm";
import { Role } from "./role/role";
import { ChatMember } from '../chats/chatmembers/chatmember.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @CreateDateColumn()
    registerDate: Date;

    @ManyToMany(() => Role, (role) => role.users, { cascade: true })
    @JoinTable()
    roles: Role[];

    @OneToMany(() => ChatMember, member => member.user)
    memberOf: ChatMember[]; // Members of the chat. This is a one-to-many relationship with the ChatMember entity.
}