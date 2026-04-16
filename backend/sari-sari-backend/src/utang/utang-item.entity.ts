import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Utang } from './utang.entity';

@Entity('utang_items')
export class UtangItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number;

  @Column()
  product_name: string;

  @Column()
  quantity: number;

  @Column('decimal')
  price: number;

  @Column('decimal')
  subtotal: number;

  @ManyToOne(() => Utang, (utang) => utang.items, {
    onDelete: 'CASCADE',
  })
  utang: Utang;
}