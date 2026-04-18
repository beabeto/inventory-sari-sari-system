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

  async getExpenses(date?: string) {
    const query = this.repo.createQueryBuilder("e");

    // ✅ filter by date (FIXED)
    if (date) {
      query.where("e.date = :date", { date });
    }

    // ✅ order by date (FIXED)
    return query.orderBy("e.date", "DESC").getMany();
  }

  async createExpense(data: Partial<Expense>) {
    const expense = this.repo.create(data);
    return this.repo.save(expense);
  }

  async deleteExpense(id: number) {
    return this.repo.delete(id);
  }
}