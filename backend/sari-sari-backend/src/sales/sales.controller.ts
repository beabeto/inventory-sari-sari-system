import { Controller, Get, Post, Body, Query, UseGuards, Req } from "@nestjs/common";
import { SalesService } from "./sales.service";
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller("sales")
export class SalesController {
  constructor(private readonly service: SalesService) {}

  @Get("today")
  getToday(@Req() req: any) {
    return this.service.getToday(req.user.userId);
  }

  @Post("today")
  create(@Req() req: any, @Body() body: { product_id: number; quantity: number }) {
    return this.service.create({ ...body, user_id: req.user.userId });
  }

  @Get("history/daily")
  daily(@Req() req: any, @Query("date") date: string) {
    return this.service.daily(date, req.user.userId);
  }

  @Get("history/weekly")
  weekly(@Req() req: any) {
    return this.service.weekly(req.user.userId);
  }

  @Get("history/monthly")
  monthly(@Req() req: any, @Query("year") year: string) {
    return this.service.monthly(Number(year), req.user.userId);
  }

  @Get("history/yearly")
  yearly(@Req() req: any) {
    return this.service.yearly(req.user.userId);
  }
}