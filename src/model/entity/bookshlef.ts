import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class bookshelf {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number; //user의 id(논리적 fk)

  @Column()
  book_id: string; //book의 id(논리적 fk)

  @Column()
  progress_state: string; //책의 진행도(읽기 전, 읽는 중, 읽음)
}
