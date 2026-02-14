import { Controller, Get, Post, Param, UseGuards, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.usersService.findAll();
    }

    @Post(':userId/roles/:roleId')
    @UseGuards(JwtAuthGuard)
    assignRole(
        @Param('userId') userId: string,
        @Param('roleId') roleId: string,
    ) {
        return this.usersService.assignRole(userId, roleId);
    }
}
