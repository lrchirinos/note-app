export class CreateNoteDto {
  title: string;
  content: string;
  categoryIds?: number[]; 
}