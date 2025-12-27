import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users') // La ruta será POST /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post() // Este es tu endpoint de "Signup"
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // (Borramos findAll, findOne, update, y remove)
}