import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UtangItem } from './utang-item.entity';

@Entity('utang')
export class Utang {
  @PrimaryGeneratedColumn()
  utang_id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', default: 0 })
  total_debt: number;

  // 💰 NEW: amount already paid
  @Column({ type: 'decimal', default: 0 })
  paid_amount: number;

  // 💰 NEW: remaining balance (auto-calculated in service)
  @Column({ type: 'decimal', default: 0 })
  remaining_debt: number;

  @Column({ default: false })
  is_paid: boolean;

  @OneToMany(() => UtangItem, (item) => item.utang, {
    cascade: true,
    eager: true,
  })
  items: UtangItem[];
}