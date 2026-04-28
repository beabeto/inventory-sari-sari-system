import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /* ================= MAIN DASHBOARD ================= */
  @Get()
  getDashboard(@Req() req: any) {
    return this.dashboardService.getDashboard(req.user?.userId);
  }

  /* ================= RECENT SALES ================= */
  @Get('recent-today')
  recentToday(@Req() req: any) {
    return this.dashboardService.recentSalesToday(req.user?.userId);
  }

  /* ================= WEEKLY ================= */
  @Get('weekly')
  weekly(@Req() req: any) {
    return this.dashboardService.weekly(req.user?.userId);
  }

  /* ================= MONTHLY ================= */
  @Get('monthly')
  monthly(@Req() req: any) {
    return this.dashboardService.monthly(new Date().getFullYear(), req.user?.userId);
  }

  /* ================= YEARLY ================= */
  @Get('yearly')
  yearly(@Req() req: any) {
    return this.dashboardService.yearly(req.user?.userId);
  }
}