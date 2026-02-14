import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        // In a real app, you might want to explicitly select the password if it's excluded by default
        if (user && (await bcrypt.compare(pass, user.password))) {
            // Strip password from result
            const userObj = (user as any).toObject ? (user as any).toObject() : user;
            const { password, ...result } = userObj;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user._id, roles: user.roles };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(user: any) {
        return this.usersService.create(user);
    }
}
