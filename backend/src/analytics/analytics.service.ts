import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginHistory, LoginHistoryDocument } from './schemas/login-history.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectModel(LoginHistory.name) private loginHistoryModel: Model<LoginHistoryDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async logLogin(userId: string, email: string, ipAddress: string, userAgent: string) {
        await this.loginHistoryModel.create({ userId, email, ipAddress, userAgent });
    }

    async getDashboardStats() {
        const totalUsers = await this.userModel.countDocuments();
        const activeUsers = await this.userModel.countDocuments({ isActive: true });

        // Logins today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const loginsToday = await this.loginHistoryModel.countDocuments({
            timestamp: { $gte: startOfDay }
        });

        return { totalUsers, activeUsers, loginsToday };
    }

    async getRecentActivity(limit = 10) {
        return this.loginHistoryModel.find().sort({ timestamp: -1 }).limit(limit).exec();
    }
}
