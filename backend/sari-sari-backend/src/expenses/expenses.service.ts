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

    if (date) {
      query.where("DATE(e.created_at) = :date", { date });
    }

    return query.orderBy("e.created_at", "DESC").getMany();
  }

  async createExpense(data: Partial<Expense>) {
    const expense = this.repo.create(data);
    return this.repo.save(expense);
  }

  async deleteExpense(id: number) {
    return this.repo.delete(id);
  }
}