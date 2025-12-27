import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NoteFormComponent } from '../../components/note-form/note-form.component';
import { NoteListComponent } from '../../components/note-list/note-list.component';
import { Note } from '../../services/note.service';

@Component({
  selector: 'app-notes-layout',
  standalone: true,
  imports: [CommonModule, NoteFormComponent, NoteListComponent, NgbModule],
  templateUrl: './notes-layout.component.html',
  styleUrl: './notes-layout.component.scss'
})
export class NotesLayoutComponent {
  modalService = inject(NgbModal);

  onEditNote(noteToEdit: Note): void {
    const modalRef = this.modalService.open(NoteFormComponent, { size: 'lg' });
    modalRef.componentInstance.noteToEdit = noteToEdit;
    modalRef.result.then((updatedNote: Note) => {
      if (updatedNote) {
        this.noteList.updateNoteInList(updatedNote);
      }
    }).catch((err: any) => {
      console.log('Edit Modal dismissed', err);
    });
  }

  @ViewChild('noteList') noteList!: NoteListComponent;

  onNoteAdded(): void {
    this.noteList.loadActiveNotes();
    this.noteList.loadArchivedNotes();
  }
}