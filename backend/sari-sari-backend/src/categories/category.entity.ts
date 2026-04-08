import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  category_id: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  // ✅ FIX: Add this relation
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}