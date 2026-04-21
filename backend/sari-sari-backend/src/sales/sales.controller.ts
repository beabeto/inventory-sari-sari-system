import { Controller, Get, Post, Body, Query } from "@nestjs/common";
import { SalesService } from "./sales.service";

@Controller("sales")
export class SalesController {
  constructor(private readonly service: SalesService) {}

  @Get("today")
  getToday() {
    return this.service.getToday();
  }

  @Post("today")
  create(@Body() body: { product_id: number; quantity: number }) {
    return this.service.create(body);
  }

  @Get("history/daily")
  daily(@Query("date") date: string) {
    return this.service.daily(date);
  }

  @Get("history/weekly")
  weekly() {
    return this.service.weekly();
  }

  @Get("history/monthly")
  monthly(@Query("year") year: string) {
    return this.service.monthly(Number(year));
  }

  @Get("history/yearly")
  yearly() {
    return this.service.yearly();
  }
}