import {
  HttpStatus,
  HttpCode,
  Param,
  Post,
  Get,
  Put,
  Body,
  Delete,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdatePasswordDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.userService.update(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.remove(id);
  }
}
