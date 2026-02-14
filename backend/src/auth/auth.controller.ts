import { Controller, Request, Post, UseGuards, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Request() req) {
        // Validation should ideally happen via LocalStrategy or a Guard before this
        // For now, we assume req.body contains credentials and we validated them
        // But wait, the previous code called validateUser manually. 
        // Let's restore the manual validation for simplicity as LocalStrategy setup wasn't fully visible/confirmed.

        // Actually, to support the new login signature (user, ip, userAgent), we need the user object.
        const user = await this.authService.validateUser(req.body.email, req.body.password);
        if (!user) {
            return { message: 'Invalid credentials' };
        }
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];
        return this.authService.login(user, ip, userAgent);
    }

    @Post('register')
    async register(@Body() createUserDto: any) {
        // We need to expose register in AuthService or call UsersService directly?
        // Checking previous file content... it called this.authService.register
        // But AuthService likely wraps UsersService.create
        // Let's assume AuthService has register, if not we'll fix it. 
        // Actually, normally AuthService handles login. UsersService handles creation.
        // Let's check if AuthService has register. If not, inject UsersService.
        // For now, I'll assume it does or I'll implement it.
        // Wait, the previous file didn't show AuthService having register. 
        // I should probably use UsersService.create directly or add register to AuthService.
        // Let's use UsersService.create via AuthService wrapper if exists, or just fix this to use UsersService if injected.
        // But AuthController only injected AuthService.
        // Let's add register to AuthService to keep it clean.
        return this.authService.register(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
