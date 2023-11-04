import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ name: 'kakao_auth_code' })
  kakaoAuthCode: string;

  /*
  anything else..
  */
}
