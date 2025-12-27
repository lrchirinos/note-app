import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface LoginResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000';
  
  private _isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor() { }


  login(credentials: {username: string, password: string}): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        this.saveToken(response.access_token);
        this.saveUsername(credentials.username); 
        this._isLoggedIn$.next(true);
      })
    );
  }

  // Llama al endpoint de Signup
  signup(credentials: {username: string, password: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, credentials);
  }

  logout(): void {
    this.removeToken();
    this.removeUsername(); 
    this._isLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  // --- MÉTODOS DE AYUDA (Helper) ---

  private hasToken(): boolean {
    return !!localStorage.getItem('notes_app_token');
  }
  private saveToken(token: string): void {
    localStorage.setItem('notes_app_token', token);
  }
  private removeToken(): void {
    localStorage.removeItem('notes_app_token');
  }
  getToken(): string | null {
    return localStorage.getItem('notes_app_token');
  }


  private saveUsername(username: string): void {
    localStorage.setItem('notes_app_user', username);
  }
  private removeUsername(): void {
    localStorage.removeItem('notes_app_user');
  }
  public getUsername(): string | null {
    return localStorage.getItem('notes_app_user');
  }
}