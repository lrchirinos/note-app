import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'; 
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@UseGuards(AuthGuard('jwt')) // ¡Usa el Guardia JWT!
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // POST /categories
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  // GET /categories
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

}