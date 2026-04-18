import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('expenses') // ✅ FORCE correct table
export class Expense {
  @PrimaryGeneratedColumn()
  expense_id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  date: Date;
}