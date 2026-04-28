import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Expense } from "./expenses.entity";

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private repo: Repository<Expense>
  ) {}

  async getExpenses(userId?: number, date?: string) {
    const query = this.repo.createQueryBuilder("e");

    if (typeof userId === 'number') {
      query.where("e.user_id = :userId", { userId });
      if (date) query.andWhere("e.date = :date", { date });
    } else if (date) {
      query.where("e.date = :date", { date });
    }

    return query.orderBy("e.date", "DESC").getMany();
  }

  async createExpense(userId: number | undefined, data: Partial<Expense>) {
    const payload = { ...(data as any), user_id: typeof userId === 'number' ? userId : (data as any).user_id };
    const expense = this.repo.create(payload);
    return this.repo.save(expense);
  }

  async deleteExpense(userId: number | undefined, id: number) {
    if (typeof userId === 'number') {
      return this.repo.delete({ expense_id: id, user_id: userId } as any);
    }
    return this.repo.delete(id);
  }
}