import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { Permission, PermissionDocument } from './schemas/permission.schema';

@Injectable()
export class RolesService {
    constructor(
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
        @InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>,
    ) { }

    async createRole(createRoleDto: any): Promise<Role> {
        const createdRole = new this.roleModel(createRoleDto);
        return createdRole.save();
    }

    async createPermission(createPermissionDto: any): Promise<Permission> {
        const createdPermission = new this.permissionModel(createPermissionDto);
        return createdPermission.save();
    }

    async findAllRoles(): Promise<Role[]> {
        return this.roleModel.find().populate('permissions').exec();
    }

    async findAllPermissions(): Promise<Permission[]> {
        return this.permissionModel.find().exec();
    }

    async assignPermissionToRole(roleId: string, permissionId: string): Promise<Role | null> {
        return this.roleModel.findByIdAndUpdate(
            roleId,
            { $addToSet: { permissions: permissionId } },
            { new: true },
        ).populate('permissions').exec();
    }

    async removePermissionFromRole(roleId: string, permissionId: string): Promise<Role | null> {
        return this.roleModel.findByIdAndUpdate(
            roleId,
            { $pull: { permissions: permissionId } },
            { new: true },
        ).populate('permissions').exec();
    }

    async findByName(name: string): Promise<Role | null> {
        return this.roleModel.findOne({ name }).exec();
    }
}
