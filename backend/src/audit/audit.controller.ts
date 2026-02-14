import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { PermissionsGuard } from '../auth/permissions.guard';
// import { Permissions } from '../auth/permissions.decorator';

@Controller('audit')
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    // @Permissions('view_audit_logs') // Assuming we might add this permission later
    findAll() {
        return this.auditService.findAll();
    }
}
