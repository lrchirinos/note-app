import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- IMPORTA
import { User } from './entities/user.entity'; // <-- IMPORTA

@Module({
  imports: [TypeOrmModule.forFeature([User])], // <-- AÑADE ESTO
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}