import { AuditService } from '../audit/audit.service';
import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Query, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly auditService: AuditService,
    ) { }

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
        // Logging done via service or here? Better here to capture admin info
        // But we need req.user for adminId.
        // Let's modify signatures to include @Request() req
        return this.usersService.assignRole(userId, roleId);
    }

    @Patch(':userId/status')
    @UseGuards(JwtAuthGuard)
    async updateStatus(
        @Param('userId') userId: string,
        @Body('isActive') isActive: boolean,
        @Request() req,
    ) {
        const result = await this.usersService.updateStatus(userId, isActive);
        if (result) {
            await this.auditService.logAction(
                req.user.sub,
                req.user.email,
                'UPDATE_USER_STATUS',
                userId,
                JSON.stringify({ isActive }),
                req.ip
            );
        }
        return result;
    }

    @Delete(':userId')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('userId') userId: string, @Request() req) {
        const result = await this.usersService.remove(userId);
        if (result) {
            await this.auditService.logAction(
                req.user.sub,
                req.user.email,
                'DELETE_USER',
                userId,
                '',
                req.ip
            );
        }
        return result;
    }

    @Put(':userId/roles')
    @UseGuards(JwtAuthGuard)
    async updateRoles(
        @Param('userId') userId: string,
        @Body('roles') roleIds: string[],
        @Request() req,
    ) {
        const result = await this.usersService.updateRoles(userId, roleIds);
        if (result) {
            await this.auditService.logAction(
                req.user.sub,
                req.user.email,
                'UPDATE_USER_ROLES',
                userId,
                JSON.stringify({ roles: roleIds }),
                req.ip
            );
        }
        return result;
    }
}
