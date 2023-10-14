import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class memo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookshelf_id: number;

  @Column()
  content: string;

  @Column()
  page: number;
}
