import { Component, EventEmitter, Output, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NoteService, Note, Category } from '../../services/note.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './note-form.component.html',
  styleUrl: './note-form.component.scss'
})
export class NoteFormComponent implements OnInit { 
  fb = inject(FormBuilder);
  noteService = inject(NoteService);

  @Input() noteToEdit?: Note; 

  // ¡CAMBIO 1! Ahora emite 'void' (un simple aviso), no la nota.
  @Output() noteCreated = new EventEmitter<void>(); 

  activeModal = inject(NgbActiveModal, { optional: true });
  noteForm: FormGroup;
  isEditMode = false;
  allCategories: Category[] = [];

  constructor() {
    this.noteForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      categories: this.fb.group({})
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.noteService.getCategories().subscribe(cats => {
      this.allCategories = cats;
      const categoriesGroup = this.noteForm.get('categories') as FormGroup;
      
      cats.forEach(cat => {
        categoriesGroup.addControl(cat.id.toString(), this.fb.control(false));
      });

      if (this.noteToEdit) {
        this.isEditMode = true;
        this.noteForm.patchValue({
          title: this.noteToEdit.title,
          content: this.noteToEdit.content,
        });

        const categoryValues: { [key: string]: boolean } = {};
        const noteCategoryIds = this.noteToEdit.categories?.map(c => c.id) || [];
        
        this.allCategories.forEach(cat => {
          categoryValues[cat.id.toString()] = noteCategoryIds.includes(cat.id);
        });
        
        categoriesGroup.patchValue(categoryValues);
      }
    });
  }

  // ¡onSubmit() COMPLETAMENTE ARREGLADO!
  onSubmit(): void {
    if (this.noteForm.invalid) {
      alert('Error! Title and content are required.');
      return;
    }

    const formValue = this.noteForm.value;
    const selectedIds = Object.entries(formValue.categories)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => parseInt(key));

    const dataToSend = {
      title: formValue.title,
      content: formValue.content,
      categoryIds: selectedIds 
    };

    if (this.isEditMode) {
      // --- MODO EDICIÓN ---
      //
      this.noteService.updateNote(this.noteToEdit!.id, dataToSend).subscribe(updatedNote => {
        this.activeModal?.close(updatedNote);
      });
    } else {
      // --- MODO CREACIÓN ---
      //
      this.noteService.createNote(dataToSend).subscribe(newNote => {
        this.noteForm.reset();
        this.noteForm.setControl('categories', this.fb.group({}));
        this.loadCategories(); // Recarga los controls
        
        //
        this.noteCreated.emit(); 
      });
    }
  }
}