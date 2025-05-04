import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChatMember } from "../chatmembers/chatmembers.entity";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    creationDate: Date;

    @Column()
    isGroup: boolean;

    @Column({ 
        type: "text",
        length: 100,
        nullable: true,
        default: null,
    })
    name: string; // only used in group chats

    @Column({ 
        type: "text",
        length: 255,
        nullable: true,
        default: null,
    })
    groupDescription: string; // only used in group chats

    @OneToMany(() => ChatMember, member => member.user)
    members: ChatMember[]; // Members of the chat. This is a one-to-many relationship with the ChatMember entity.
}