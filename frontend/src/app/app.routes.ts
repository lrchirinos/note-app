import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { NotesLayoutComponent } from './pages/notes-layout/notes-layout.component';
import { authGuard } from './services/auth.guard'; 

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: '', 
    component: NotesLayoutComponent,
    canActivate: [authGuard] 
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];