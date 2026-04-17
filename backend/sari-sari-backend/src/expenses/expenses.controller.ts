import { Controller, Get, Post, Delete, Body, Param, Query } from "@nestjs/common";
import { ExpensesService } from "./expenses.service";

@Controller("expenses")
export class ExpensesController {
  constructor(private readonly service: ExpensesService) {}

  @Get()
  getAll(@Query("date") date?: string) {
    return this.service.getExpenses(date);
  }

  @Post()
  create(@Body() body: any) {
    return this.service.createExpense(body);
  }

  @Delete(":id")
  delete(@Param("id") id: number) {
    return this.service.deleteExpense(id);
  }
}