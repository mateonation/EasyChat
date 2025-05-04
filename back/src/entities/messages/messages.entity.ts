import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "text",
        length: 280,
    })
    content: string;

    @Column()
    messageDate: Date;
}