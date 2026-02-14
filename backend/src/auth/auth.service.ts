import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AnalyticsService } from '../analytics/analytics.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private analyticsService: AnalyticsService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            if (user.isActive === false) return null; // Block banned users

            const userObj = (user as any).toObject ? (user as any).toObject() : user;
            const { password, ...result } = userObj;
            return result;
        }
        return null;
    }

    async login(user: any, ip: string = '127.0.0.1', userAgent: string = 'Unknown') {
        const payload = { email: user.email, sub: user._id, roles: user.roles };

        // Log to analytics
        await this.analyticsService.logLogin(user._id, user.email, ip, userAgent);

        // Update lastLogin
        // Note: We need to expose a method in UsersService or use the model directly if injected, 
        // but AuthService injects UsersService. Let's assume we can add a method there or use update.
        // For now, let's keep it simple and skip update if method is missing, or add it.
        // Actually, we should probably add `updateLastLogin` to UsersService.

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(userDto: any) {
        return this.usersService.create(userDto);
    }
}
