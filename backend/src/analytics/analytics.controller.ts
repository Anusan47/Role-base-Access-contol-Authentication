import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { PermissionsGuard } from '../common/guards/permissions.guard'; // Ideally protect this

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('dashboard')
    @UseGuards(JwtAuthGuard)
    async getDashboardStats() {
        return this.analyticsService.getDashboardStats();
    }

    @Get('activity')
    @UseGuards(JwtAuthGuard)
    async getRecentActivity() {
        return this.analyticsService.getRecentActivity();
    }
}
