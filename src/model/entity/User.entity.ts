import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ name: "oauth_id" })
  oauthId: string;

  @Column({ name: 'vender' })
  vender: string;

  @Column({ name: "refresh_token", nullable: true })
  refreshToken: string;


  /*
  anything else..
  */
}
