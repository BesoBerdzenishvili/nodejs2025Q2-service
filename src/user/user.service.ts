import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto } from './dto/user.dto';

import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException("User doesn't exist", HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    const newUser = await this.usersRepository.save(user);
    delete newUser.password;
    return newUser;
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException("User doesn't exist", HttpStatus.NOT_FOUND);
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new HttpException('Old password is wrong', HttpStatus.FORBIDDEN);
    }
    const updatedUser = await this.usersRepository.update(
      { id },
      {
        password: updatePasswordDto.newPassword,
      },
    );
    return updatedUser;
  }

  async remove(id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException("Record doesn't exist", HttpStatus.NOT_FOUND);
    }
    await this.usersRepository.delete({ id });
  }
}
