import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '../roles/schemas/role.schema';
import { Permission, PermissionDocument } from '../roles/schemas/permission.schema';

@Injectable()
export class SeedService implements OnModuleInit {
    constructor(
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
        @InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>,
    ) { }

    async onModuleInit() {
        await this.seedPermissions();
        await this.seedRoles();
    }

    async seedPermissions() {
        const permissions = [
            { name: 'view_users', description: 'View all users' },
            { name: 'delete_user', description: 'Delete a user' },
            { name: 'manage_roles', description: 'Create and edit roles' },
            { name: 'manage_permissions', description: 'Create and edit permissions' },
            { name: 'view_dashboard', description: 'Access dashboard' },
        ];

        for (const perm of permissions) {
            const existing = await this.permissionModel.findOne({ name: perm.name });
            if (!existing) {
                await this.permissionModel.create(perm);
                console.log(`Seeded permission: ${perm.name}`);
            }
        }
    }

    async seedRoles() {
        const roles = [
            { name: 'Admin', description: 'Administrator with full access' },
            { name: 'Manager', description: 'Manager with limited access' },
            { name: 'User', description: 'Standard user' },
        ];

        for (const roleData of roles) {
            const existing = await this.roleModel.findOne({ name: roleData.name });
            if (!existing) {
                const role = await this.roleModel.create(roleData);
                console.log(`Seeded role: ${roleData.name}`);

                // Assign permissions to Admin
                if (roleData.name === 'Admin') {
                    const allPermissions = await this.permissionModel.find();
                    role.permissions = allPermissions;
                    await role.save();
                    console.log('Assigned all permissions to Admin');
                }
                // Assign dashboard to others
                else {
                    const dashboardPerm = await this.permissionModel.findOne({ name: 'view_dashboard' });
                    if (dashboardPerm) {
                        role.permissions = [dashboardPerm];
                        await role.save();
                    }
                }
            }
        }
    }
}
