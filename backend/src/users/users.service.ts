import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // --- MÉTODO CREATE (para Signup) ---
  // Cambiamos el tipo de retorno. Ya no devolvemos 'User' (que tiene password),
  //    sino 'Omit<User, 'password'>' (un 'User' OMITIENDO el password).
  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { username, password } = createUserDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOneBy({ username }); // <-- 2. Usamos findOneBy
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear y guardar el nuevo usuario
    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    //Creamos un nuevo objeto 'result' que tiene todo lo de 'savedUser'
    //EXCEPTO la propiedad 'password'.
    const { password: _, ...result } = savedUser;
    
    return result;
  }

  //Ajustamos el tipo de retorno. Devuelve 'null' si no lo encuentra.
  async findOneByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username });
  }
}