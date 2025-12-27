import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NoteService, Note, Category } from '../../services/note.service';
import { NoteItemComponent } from '../note-item/note-item.component';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NoteItemComponent, NgbModule],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.scss'
})
export class NoteListComponent implements OnInit {

  // Dos arrays para guardar listas
  activeNotes: Note[] = [];
  archivedNotes: Note[] = [];

  @Output() editNoteClicked = new EventEmitter<Note>(); //exporta nota a editar para activar note-form

  allCategories: Category[] = [];
  filterForm: FormGroup;

  constructor(
    private noteService: NoteService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({});
   }

  ngOnInit(): void {
    this.loadCategoriesAndNotes(); 
    this.loadArchivedNotes();
  }

  // ¡NUEVO MÉTODO!
  loadCategoriesAndNotes(): void {
    this.noteService.getCategories().subscribe(cats => {
      this.allCategories = cats;
      const filterGroup = this.filterForm;
      
      // Construye los checkboxes (todos en 'false' al inicio)
      cats.forEach(cat => {
        filterGroup.addControl(cat.id.toString(), this.fb.control(false));
      });
      
      // ¡MAGIA! Escucha los cambios en el formulario de filtro
      filterGroup.valueChanges.subscribe(() => {
        this.loadActiveNotes(); // Llama a 'loadActiveNotes' cada vez que un checkbox cambia
      });

      // Carga las notas activas POR PRIMERA VEZ
      this.loadActiveNotes(); 
    });
  }

  // ¡MÉTODO 'loadNotes' ACTUALIZADO Y DIVIDIDO!
  // Ahora solo carga notas ACTIVAS (y usa el filtro)
  loadActiveNotes(): void {
    // Lee los valores del formulario de filtro
    const filterValue = this.filterForm.value;
    const selectedIds = Object.entries(filterValue)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => parseInt(key));

    // Llama al servicio de notas con los IDs seleccionados
    this.noteService.getActiveNotes(selectedIds).subscribe(notes => {
      this.activeNotes = notes;
    });
  }

  // ¡NUEVO MÉTODO! (separado, para que no se recargue con el filtro)
  loadArchivedNotes(): void {
    this.noteService.getArchivedNotes().subscribe(notes => {
      this.archivedNotes = notes;
    });
  }

  onArchive(id: number): void {
    this.noteService.archiveNote(id).subscribe(() => {
      this.loadActiveNotes(); // Recarga activas (para que desaparezca de la lista filtrada)
      this.loadArchivedNotes(); // Recarga archivadas (para el contador)
    });
  }

  onUnarchive(id: number): void {
    this.noteService.unarchiveNote(id).subscribe(() => {
      this.loadActiveNotes(); // Recarga activas (para que aparezca en la lista filtrada)
      this.loadArchivedNotes(); // Recarga archivadas
    });
  }

  onEdit(note: Note): void {
    // Dispara el evento y "envía" la nota completa al padre
    this.editNoteClicked.emit(note);
  }

  onDelete(id: number): void {
    //Pedir confirmación antes de borrar
    if (!confirm('Are you sure you want to permanently delete this note?')) {
      return; // Si el usuario cancela, no hacemos nada
    }

    //Llama al servicio para BORRAR en el backend
    this.noteService.deleteNote(id).subscribe(() => {
      // Recarga la lista que esté activa
      if (this.showActive) {
        this.loadActiveNotes();
      } else {
        this.loadArchivedNotes();
      }
    });
  }
  // El componente padre (app.component) llamará a esto.
  public addNewNoteToList(newNote: Note): void {
    // Simplemente añade la nota nueva al inicio del array 'activeNotes'.
    // Angular la mostrará en la UI automáticamente.
    this.loadActiveNotes();
  }

  public updateNoteInList(updatedNote: Note): void {
    this.loadActiveNotes();
  }
  // Mostrar listas activas
  showActive = true;
}