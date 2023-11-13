import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  categoryId: number;

  @Column()
  name: string;

  @Column({ name: 'position_x' })
  positionX: number;

  @Column({ name: 'position_y' })
  positionY: number;
}
