import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class book {
  @PrimaryColumn()
  id: string; //openAPI 상에서 불러온 그대로 저장

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  description: string; //책 설명

  /*
  anything else
  */
}
