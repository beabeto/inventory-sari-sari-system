import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price: number;

  // ✅ Stock (ONLY ONCE)
  @Column({ type: 'int', default: 0 })
  stock: number;

  // ✅ Reorder level (for alerts/dashboard)
  @Column({ type: 'int', default: 5 })
  reorder_level: number;

  // ✅ Foreign key
  @Column()
  category_id: number;

  @ManyToOne(() => Category, (category) => category.products, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}