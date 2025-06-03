import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, CreateDateColumn } from "typeorm";
import { Role } from "./role/role";
import { ChatMember } from '../chats/chatmembers/chatmember.entity';
import { Message } from "../messages/message.entity";
import { UtcDateTransformer } from "src/common/transformers/UtcDateTransformer";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ 
        unique: true, 
    })
    username: string;

    @Column()
    firstName: string;

    @Column({
        nullable: true, // Last name is optional
        default: null, // Default to null if not provided
    })
    lastName: string;

    @Column({
        nullable: true,
        default: null,
    })
    description: string;

    @Column()
    password: string;

    @CreateDateColumn({ 
        type: 'timestamp',
        transformer: UtcDateTransformer,
    })
    registerDate: Date;

    @Column({
        type: 'date',
    })
    birthDate: Date;

    @ManyToMany(() => Role, (role) => role.users, { cascade: true })
    @JoinTable()
    roles: Role[];

    @OneToMany(() => ChatMember, member => member.user)
    memberOf: ChatMember[]; // Members of the chat. This is a one-to-many relationship with the ChatMember entity.

    @OneToMany(() => Message, message => message.user)
    messages: Message[];
}