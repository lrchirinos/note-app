import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // --- MÉTODO CREATE (¡ACTUALIZADO CON userId!) ---
  async create(createNoteDto: CreateNoteDto, userId: number) {
    const { categoryIds, ...noteData } = createNoteDto;
    
    // 1. Creamos la nota y le asignamos el 'userId' del dueño
    const newNote = this.notesRepository.create({
      ...noteData,
      userId: userId, // <-- ¡AQUÍ ESTÁ LA CONEXIÓN!
    });

    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoryRepository.findBy({
        id: In(categoryIds),
      });
      newNote.categories = categories;
    }

    return this.notesRepository.save(newNote);
  }

  // --- MÉTODO findAllActive (¡ACTUALIZADO CON userId!) ---
  async findAllActive(userId: number, categoryIds?: number[]) {
    const query = this.notesRepository.createQueryBuilder('note');
    query.leftJoinAndSelect('note.categories', 'category');
    
    // 2. ¡FILTRO DE AUTORIZACIÓN! Solo trae notas del usuario logueado
    query.where('note.isArchived = :isArchived', { isArchived: false });
    query.andWhere('note.userId = :userId', { userId }); // <-- ¡AQUÍ ESTÁ LA SEGURIDAD!

    if (categoryIds && categoryIds.length > 0) {
      query.andWhere('category.id IN (:...ids)', { ids: categoryIds });
    }

    return query.orderBy('note.updatedAt', 'DESC').getMany();
  }

  // --- MÉTODO findAllArchived (¡ACTUALIZADO CON userId!) ---
  async findAllArchived(userId: number) {
    return this.notesRepository.find({
      where: { 
        isArchived: true,
        userId: userId, // <-- ¡AQUÍ ESTÁ LA SEGURIDAD!
      },
      order: { updatedAt: 'DESC' },
    });
  }

  // --- MÉTODO findOne (¡ACTUALIZADO CON userId!) ---
  // Este método ahora es privado, solo para uso interno del servicio
  private async findOne(id: number, userId: number) {
    // 3. ¡FILTRO DE AUTORIZACIÓN! Busca la nota por ID Y por Dueño
    const note = await this.notesRepository.findOne({ where: { id, userId } });
    if (!note) {
      // Si no la encuentra O no le pertenece al usuario, lanza error
      throw new NotFoundException(`Note with ID #${id} not found`);
    }
    return note;
  }

  // --- MÉTODO UPDATE (¡ACTUALIZADO CON userId!) ---
  async update(id: number, updateNoteDto: UpdateNoteDto, userId: number) {
    const { categoryIds, ...noteData } = updateNoteDto;

    // 4. Usa el 'findOne' privado, que ya tiene el chequeo de seguridad
    const note = await this.findOne(id, userId); 

    const updatedNote = this.notesRepository.merge(note, noteData);

    if (categoryIds) {
      const categories = await this.categoryRepository.findBy({
        id: In(categoryIds),
      });
      updatedNote.categories = categories;
    }

    return this.notesRepository.save(updatedNote);
  }

  // --- TODOS LOS DEMÁS MÉTODOS AHORA USAN EL userId ---

  async remove(id: number, userId: number) {
    const note = await this.findOne(id, userId); // <-- 5. Chequeo de seguridad
    return this.notesRepository.remove(note);
  }

  async archive(id: number, userId: number) {
    const note = await this.findOne(id, userId); // <-- 6. Chequeo de seguridad
    note.isArchived = true;
    return this.notesRepository.save(note);
  }

  async unarchive(id: number, userId: number) {
    const note = await this.findOne(id, userId); // <-- 7. Chequeo de seguridad
    note.isArchived = false;
    return this.notesRepository.save(note);
  }
}