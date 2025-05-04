import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "../users/user.entity";
import { Chat } from "../chats/chats.entity";
import { ChatMemberRole } from "src/types/chat-members-roles";

@Entity()
@Unique(["user", "chat"]) // Only an user can be member of a chat once
export class ChatMember {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.chatmembers, { onDelete: "CASCADE" })
    user: User;

    @ManyToOne(() => Chat, (chat) => chat.members, { onDelete: "CASCADE" })
    chat: Chat;

    @Column({
        type: 'enum',
        enum: ['creator', 'admin', 'member'],
        default: 'member',
    })
    role: ChatMemberRole; // Role of the user in the group chat ('creator' and 'admin' are only used in group chats)

    @Column()
    joinDate: Date;
}