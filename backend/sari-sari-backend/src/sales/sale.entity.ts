import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Product } from "../products/product.entity";
import { User } from "../users/user.entity";

@Entity("sales")
export class Sale {
  @PrimaryGeneratedColumn()
  sale_id: number;

  @Column()
  product_id: number;

  @ManyToOne(() => Product, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column("int")
  quantity: number;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column("decimal", { precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn()
  sale_date: Date;

  @Column({ nullable: true })
  user_id?: number;

  @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;
}