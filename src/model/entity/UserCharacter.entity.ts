import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BasicDate } from './BasicDate.entity';

@Entity('user_character')
export class UserCharacter extends BasicDate {
  @PrimaryGeneratedColumn({ name: 'user_character_id' })
  userCharacterId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'character_id' })
  characterId: number;

  @Column()
  name: string;
}
