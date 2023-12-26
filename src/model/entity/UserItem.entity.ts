import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BasicDate } from './BasicDate.entity';

@Entity('user_item')
export class UserItem extends BasicDate {
  @PrimaryGeneratedColumn({ name: 'user_item_id' })
  userItemId: number;

  @Column({ name: 'user_id' })
  userId: number;
  
    @Column({ name: "item_id" })
    itemId: number;

    @Column({ name: "activation" })
    activation: boolean;
}
