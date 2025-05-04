import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}