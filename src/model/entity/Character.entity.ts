import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BasicDate } from './BasicDate.entity';

@Entity('character')
export class Character extends BasicDate {
  @PrimaryGeneratedColumn({ name: 'character_id' })
  characterId: number;

  @Column()
  content: string;
}
