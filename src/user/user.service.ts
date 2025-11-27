import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdatePasswordDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private users: User[] = [];

  findAll(): Omit<User, 'password'>[] {
    return this.users.map(({ password, ...user }) => user);
  }

  findOne(id: string): Omit<User, 'password'> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }

  create(createUserDto: CreateUserDto): Omit<User, 'password'> {
    const now = Date.now();
    const user: User = {
      id: randomUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(user);
    const { password, ...result } = user;
    return result;
  }

  update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Omit<User, 'password'> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }
    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    const { password, ...result } = user;
    return result;
  }

  remove(id: string): void {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }
    this.users.splice(index, 1);
  }

  findByLogin(login: string): User | undefined {
    return this.users.find((u) => u.login === login);
  }
}
