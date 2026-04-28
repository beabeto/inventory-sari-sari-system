import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { UtangItem } from './utang-item.entity';
import { User } from '../users/user.entity';

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

  @Column({ nullable: true })
  user_id?: number;

  @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;
}