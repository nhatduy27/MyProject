import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<{ 
    message: string; 
    user: { 
      _id: string; 
      email: string; 
      createdAt: Date; 
    } 
  }> {
    const { email, password } = createUserDto;

    // Check if user exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await this.userModel.create({
        email,
        password: hashedPassword,
      });

      // Create response object manually
      const userResponse = {
        _id: user._id.toString(),
        email: user.email,
        createdAt: user.createdAt,
      };

      return {
        message: 'User registered successfully',
        user: userResponse,
      };
    } catch (error) {
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }
}