import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

//para formato de la bd de categoria
export interface Category {
  id: number;
  name: string;
}

//para formato de la bd de notas
export interface Note {
  id: number;
  title: string;
  content: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  categories: Category[];
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  // Esta es la URL del api
  private apiUrl = 'http://localhost:3000/notes'; //api para notas
  private categoryApiUrl = 'http://localhost:3000/categories'; //api para categorias

  constructor(private http: HttpClient) { }

  // GET /categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoryApiUrl);
  }

  // GET /notes (¡ACTUALIZADO PARA FILTROS!)
getActiveNotes(categoryIds?: number[]): Observable<Note[]> {
  let params = new HttpParams();

  // Si nos pasan IDs de categoría...
  if (categoryIds && categoryIds.length > 0) {
    // ...los convertimos en un string "1,2,3" y lo añadimos a la URL
    params = params.append('categoryIds', categoryIds.join(','));
  }

  // Enviamos la petición GET /notes?categoryIds=1,2,3
  return this.http.get<Note[]>(this.apiUrl, { params });
}

  // GET /notes/archived
  getArchivedNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/archived`);
  }

  // POST /notes
  createNote(noteData: { title: string, content: string, categoryIds?: number[] }): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, noteData);
  }

  // PATCH /notes/:id
  updateNote(id: number, noteData: { title?: string, content?: string, categoryIds?: number[] }): Observable<Note> {
    return this.http.patch<Note>(`${this.apiUrl}/${id}`, noteData);
  }

  // DELETE /notes/:id
  deleteNote(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // PATCH /notes/:id/archive
  archiveNote(id: number): Observable<Note> {
    return this.http.patch<Note>(`${this.apiUrl}/${id}/archive`, {});
  }

  // PATCH /notes/:id/unarchive
  unarchiveNote(id: number): Observable<Note> {
    return this.http.patch<Note>(`${this.apiUrl}/${id}/unarchive`, {});
  }
}