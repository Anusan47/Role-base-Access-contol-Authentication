import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Query('search') search: string) {
        const query = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ]
        } : {};
        return this.usersService.findAll(query);
    }

    @Post(':userId/roles/:roleId')
    @UseGuards(JwtAuthGuard)
    assignRole(
        @Param('userId') userId: string,
        @Param('roleId') roleId: string,
    ) {
        return this.usersService.assignRole(userId, roleId);
    }

    @Patch(':userId/status')
    @UseGuards(JwtAuthGuard)
    updateStatus(
        @Param('userId') userId: string,
        @Body('isActive') isActive: boolean,
    ) {
        return this.usersService.updateStatus(userId, isActive);
    }

    @Delete(':userId')
    @UseGuards(JwtAuthGuard)
    remove(@Param('userId') userId: string) {
        return this.usersService.remove(userId);
    }
}
