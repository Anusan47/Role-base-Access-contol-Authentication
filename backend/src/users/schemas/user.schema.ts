import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from '../../roles/schemas/role.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }] })
    roles: Role[];

    @Prop({ default: true })
    isActive: boolean;

    @Prop()
    lastLogin: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
