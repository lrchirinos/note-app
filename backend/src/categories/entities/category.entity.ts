import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Note } from '../../notes/entities/note.entity'; 

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true }) // Hacemos que el nombre sea único
  name: string;

  @ManyToMany(() => Note, (note) => note.categories)
  notes: Note[]; // Una categoría puede tener muchas notas
}