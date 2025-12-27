import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Note } from '../../services/note.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-item.component.html',
  styleUrl: './note-item.component.scss'
})
export class NoteItemComponent {
  @Input() note!: Note;
  @Input() isArchivedView: boolean = false;

  @Output() edit = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<number>();
  @Output() archive = new EventEmitter<number>();
  @Output() unarchive = new EventEmitter<number>();

  onEditClick() {
    this.edit.emit(this.note);
  }

  onDeleteClick() {
    this.delete.emit(this.note.id);
  }

  onArchiveClick() {
    this.archive.emit(this.note.id);
  }

  onUnarchiveClick() {
    this.unarchive.emit(this.note.id);
  }
}
