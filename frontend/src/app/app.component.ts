import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgbModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
  //INYECTA el servicio
  private authService = inject(AuthService);
  
  //EXPONE el estado de login al HTML
  public isLoggedIn$ = this.authService.isLoggedIn$;

  //CREA un 'getter' para el username
  get username(): string | null {
    return this.authService.getUsername();
  }

  //CREA la función de logout
  onLogout(): void {
    this.authService.logout();
  }
  //-------Para DarkMode------------
  isDarkMode = false;
  toggleTheme(): void {
    //Invierte el estado
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', theme);
  }
}