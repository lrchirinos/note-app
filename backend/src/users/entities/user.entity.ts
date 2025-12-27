import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Note } from '../../notes/entities/note.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string; // Usaremos 'username' para el login

  @Column({ type: 'varchar' })
  password: string; // Guardaremos la contraseña hasheada (encriptada)

  @CreateDateColumn()
  createdAt: Date;
  
  
  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];
  
}