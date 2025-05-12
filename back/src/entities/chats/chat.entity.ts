import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChatMember } from "./chatmembers/chatmember.entity";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    creationDate: Date;

    @Column({
        type: 'boolean',
        default: false,
    })
    isGroup: boolean;

    @Column({ 
        type: "text",
        nullable: true,
        default: null,
    })
    name: string; // only used in group chats

    @Column({ 
        type: "text",
        nullable: true,
        default: null,
    })
    groupDescription: string; // only used in group chats

    @OneToMany(() => ChatMember, member => member.chat, { eager: true })
    members: ChatMember[]; // Members of the chat. This is a one-to-many relationship with the ChatMember entity.
}