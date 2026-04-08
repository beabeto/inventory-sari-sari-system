import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn({ name: 'brand_id' })
  brand_id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'category_id' })
  category_id: number;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}