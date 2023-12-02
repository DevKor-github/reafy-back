import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  
  @ApiProperty({ description: '유저 id' })
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @ApiProperty({ description: 'oauth user id' })
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
