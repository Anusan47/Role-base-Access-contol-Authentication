import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(createUserDto: any): Promise<User> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
        const createdUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });
        return createdUser.save();
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
        return this.userModel.findByIdAndUpdate(userId, { isActive }, { new: true }).exec();
    }

    async remove(userId: string): Promise<User | null> {
        return this.userModel.findByIdAndDelete(userId).exec();
    }
}
