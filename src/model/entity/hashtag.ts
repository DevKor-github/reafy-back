import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from "typeorm";

Entity();
export class hashtag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  keyword: string;
}
