import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';

@Injectable()
export class AuditService {
    constructor(@InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>) { }

    async logAction(adminId: string, adminEmail: string, action: string, targetId: string, details: string, ipAddress: string = '') {
        const log = new this.auditLogModel({
            adminId,
            adminEmail,
            action,
            targetId,
            details,
            ipAddress,
        });
        return log.save();
    }

    async findAll() {
        return this.auditLogModel.find().sort({ createdAt: -1 }).limit(100).exec();
    }
}
