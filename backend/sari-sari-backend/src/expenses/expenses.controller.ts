import { Controller, Get, Post, Delete, Body, Param, Query, ParseIntPipe, UseGuards, Req } from "@nestjs/common";
import { ExpensesService } from "./expenses.service";
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller("expenses")
export class ExpensesController {
  constructor(private readonly service: ExpensesService) {}

  @Get()
  getAll(@Req() req: any, @Query("date") date?: string) {
    return this.service.getExpenses(req.user.userId, date);
  }

  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.service.createExpense(req.user.userId, body);
  }

  @Delete(":id")
  delete(@Req() req: any, @Param("id", ParseIntPipe) id: number) {
    return this.service.deleteExpense(req.user.userId, id);
  }
}