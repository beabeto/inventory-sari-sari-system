import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Expense } from "./expenses.entity";
import { ExpensesService } from "./expenses.service";
import { ExpensesController } from "./expenses.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Expense])],
  providers: [ExpensesService],
  controllers: [ExpensesController],
})
export class ExpensesModule {}