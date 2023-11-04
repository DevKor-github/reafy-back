import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_character')
export class UserCharacter {
  @PrimaryGeneratedColumn({ name: 'user_character_id' })
  userCharacterId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'character_id' })
  characterId: number;

  @Column()
  name: string;
}
