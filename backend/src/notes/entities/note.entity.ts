import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';

@Entity() // Esto le dice a TypeORM que esta clase es una tabla de la BD
export class Note {
  @PrimaryGeneratedColumn() // Columna de ID, autoincremental
  id: number;

  @Column({ type: 'varchar', length: 255 }) // Columna de texto
  title: string;

  @Column({ type: 'text' }) // Columna de texto largo
  content: string;

  @Column({ type: 'boolean', default: false }) // Columna booleana, por defecto en 'false'
  isArchived: boolean;

  @CreateDateColumn() // Columna de fecha de creación (automática)
  createdAt: Date;

  @UpdateDateColumn() // Columna de fecha de actualización (automática)
  updatedAt: Date;

  //Para BD de mucho a muchos
  @ManyToMany(() => Category, { eager: true }) // <-- 'eager: true' es útil, hace que cargue las categorías automáticamente
  @JoinTable() 
  categories: Category[]; // Una nota puede tener muchas categorías

  //    Guardará el ID del usuario que creó la nota
  @Column()
  userId: number;

  //    Le dice a TypeORM que muchas notas pertenecen a un usuario
  @ManyToOne(() => User, (user) => user.notes, { eager: false })
  user: User;
}