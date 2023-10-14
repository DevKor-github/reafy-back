import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class user {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  /*
  anything else..
  */
}
