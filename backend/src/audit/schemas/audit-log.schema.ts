import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
    @Prop({ required: true })
    adminId: string; // ID of the user performing the action

    @Prop({ required: true })
    adminEmail: string;

    @Prop({ required: true })
    action: string; // e.g., 'CREATE_ROLE', 'DELETE_USER'

    @Prop()
    targetId: string; // ID of the affected entity

    @Prop()
    details: string; // JSON string of details

    @Prop()
    ipAddress: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
