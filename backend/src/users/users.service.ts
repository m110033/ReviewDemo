import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async onApplicationBootstrap() {
    const adminExists = await this.userModel.exists({
      email: 'admin@example.com',
    });
    if (!adminExists) {
      const hashedPassword = await this.encryptPassword('admin20241231');
      const adminUser = new this.userModel({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
        role: 'admin',
      });
      await adminUser.save();
    }
  }

  async encryptPassword(password: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email }).exec();
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findOneByEmail(email);
    const isValied = await bcrypt.compare(password, user.password);
    if (!!user && isValied) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
