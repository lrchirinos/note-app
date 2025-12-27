import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@UseGuards(AuthGuard('jwt')) 
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  // POST /notes
  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @Request() req: any) {
    return this.notesService.create(createNoteDto, req.user.id);
  }

  // GET /notes
  @Get()
  findAllActive(@Request() req: any, @Query('categoryIds') categoryIds?: string){
    const categoryIdsArr = categoryIds
      ? categoryIds.split(',').map(id => parseInt(id.trim(), 10))
      : undefined;
    return this.notesService.findAllActive(req.user.id, categoryIdsArr);
  }

  // GET /notes/archived
  @Get('archived')
  findAllArchived(@Request() req: any) {
    return this.notesService.findAllArchived(req.user.id);
  }



  // PATCH /notes/:id
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateNoteDto: UpdateNoteDto, @Request() req: any) {
    return this.notesService.update(id, updateNoteDto, req.user.id);
  }

  // DELETE /notes/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.notesService.remove(id, req.user.id);
  }

  // PATCH /notes/:id/archive
  @Patch(':id/archive')
  archive(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.notesService.archive(id, req.user.id);
  }

  // PATCH /notes/:id/unarchive
  @Patch(':id/unarchive')
  unarchive(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.notesService.unarchive(id, req.user.id);
  }
}