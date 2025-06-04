import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChatMember } from "./chatmembers/chatmember.entity";
import { Message } from "../messages/message.entity";
import { ChatType } from "src/common/enums/chat-type.enum";
import { UtcDateTransformer } from "src/common/transformers/UtcDateTransformer";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ 
        type: 'timestamp',
        transformer: UtcDateTransformer,
    })
    creationDate: Date;

    @Column({
        type: 'enum',
        enum: ChatType,
        default: ChatType.PRIVATE,
        nullable: false,
    })
    type: ChatType; // Type of chat (private by default). Private chats are one-to-one, group chats can have multiple members.

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
    description: string; // only used in group chats

    @Column({
        type: 'timestamp',
        transformer: UtcDateTransformer,
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP', 
    })
    updateDate: Date; // Timestamp that's updated automatically when the chat is modified.

    @OneToMany(() => ChatMember, member => member.chat, { cascade: true, })
    members: ChatMember[]; // Members of the chat. This is a one-to-many relationship with the ChatMember entity.

    @OneToMany(() => Message, (message) => message.chat, { cascade: true, })
    messages: Message[]; // List of messages in the chat
}