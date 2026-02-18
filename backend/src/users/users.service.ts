import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private mailService: MailService,
    ) { }

    async create(createUserDto: any): Promise<User> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
        const createdUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });
        const savedUser = await createdUser.save();
        // Generate a random token for confirmation (simplified for now, ideally store in DB)
        const token = await bcrypt.hash(savedUser.email, 10);
        try {
            await this.mailService.sendUserConfirmation(savedUser, token);
        } catch (error) {
            // Log error but don't fail user creation? Or fail? 
            // Better to log and allow creation, user can request resend later.
            console.error('Failed to send welcome email', error);
        }
        return savedUser;
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).populate({
            path: 'roles',
            populate: { path: 'permissions' }
        }).exec();
    }

    async findById(id: string): Promise<User | null> {
        return this.userModel.findById(id).populate({
            path: 'roles',
            populate: { path: 'permissions' }
        }).exec();
    }

    async findAll(query?: any): Promise<User[]> {
        return this.userModel.find(query).populate('roles').sort({ createdAt: -1 }).exec();
    }

    async assignRole(userId: string, roleId: string): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(
            userId,
            { $addToSet: { roles: roleId } },
            { new: true },
        ).populate('roles').exec();
    }

    async updateStatus(userId: string, isActive: boolean): Promise<User | null> {
        const user = await this.userModel.findByIdAndUpdate(userId, { isActive }, { new: true }).exec();
        if (user) {
            try {
                await this.mailService.sendUserStatusChange(user, isActive ? 'Active' : 'Banned');
            } catch (error) {
                console.error('Failed to send status change email', error);
            }
        }
        return user;
    }

    async remove(userId: string): Promise<User | null> {
        return this.userModel.findByIdAndDelete(userId).exec();
    }
    async updateRoles(userId: string, roleIds: string[]): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(
            userId,
            { roles: roleIds },
            { new: true },
        ).populate('roles').exec();
    }

    async setPasswordResetToken(userId: string, token: string, expires: Date): Promise<void> {
        await this.userModel.findByIdAndUpdate(userId, {
            resetPasswordToken: token,
            resetPasswordExpires: expires,
        });
    }

    async updatePassword(userId: string, password: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(userId, {
            password,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        });
    }
}
