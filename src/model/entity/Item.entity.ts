import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('item')
export class Item {
  @PrimaryGeneratedColumn({ name: 'item_id' })
  itemId: number;

  @Column()
  name: string;

  @Column({ name: 'image_url' })
  imageURL: string;

  @Column()
  price: number;

  @Column({ name: 'category_id' })
  categoryId: number;
}
