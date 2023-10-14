import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("character")
export class Character {
    @PrimaryGeneratedColumn({ name: "character_id" })
    characterId: number;

    @Column()
    name: string;

    @Column({ name: "content" })
    content: string;

}