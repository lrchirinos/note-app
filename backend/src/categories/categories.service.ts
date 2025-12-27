import { Injectable, ConflictException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService implements OnModuleInit { // <-- 2. IMPLEMENTA OnModuleInit
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Esta función se ejecutará automáticamente cuando el backend arranque
  async onModuleInit() {
    const defaultCategories = ['Work', 'Home', 'Sports', 'Fun'];

    for (const name of defaultCategories) {
      const exists = await this.categoryRepository.findOneBy({ name });

      if (!exists) {
        const newCategory = this.categoryRepository.create({ name });
        await this.categoryRepository.save(newCategory);
        console.log(`[SEED] Default category "${name}" created.`);
      }
    }
  }


  async create(createCategoryDto: CreateCategoryDto) {
    // Verificamos si ya existe una categoría con ese nombre
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    const newCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

  findAll() {
    // Simplemente devuelve todas las categorías
    return this.categoryRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    this.categoryRepository.merge(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}