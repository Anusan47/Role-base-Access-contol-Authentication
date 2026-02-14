import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    createRole(@Body() createRoleDto: any) {
        return this.rolesService.createRole(createRoleDto);
    }

    @Get()
    // @UseGuards(JwtAuthGuard) // Allow public access for now or protect
    findAllRoles() {
        return this.rolesService.findAllRoles();
    }

    @Delete(':roleId')
    @UseGuards(JwtAuthGuard)
    deleteRole(@Param('roleId') roleId: string) {
        return this.rolesService.deleteRole(roleId);
    }

    @Post('permissions')
    @UseGuards(JwtAuthGuard)
    createPermission(@Body() createPermissionDto: any) {
        return this.rolesService.createPermission(createPermissionDto);
    }

    @Get('permissions')
    @UseGuards(JwtAuthGuard)
    findAllPermissions() {
        return this.rolesService.findAllPermissions();
    }

    @Post(':roleId/permissions/:permissionId')
    @UseGuards(JwtAuthGuard)
    assignPermission(
        @Param('roleId') roleId: string,
        @Param('permissionId') permissionId: string,
    ) {
        return this.rolesService.assignPermissionToRole(roleId, permissionId);
    }

    @Delete(':roleId/permissions/:permissionId')
    @UseGuards(JwtAuthGuard)
    removePermission(
        @Param('roleId') roleId: string,
        @Param('permissionId') permissionId: string,
    ) {
        return this.rolesService.removePermissionFromRole(roleId, permissionId);
    }
}
