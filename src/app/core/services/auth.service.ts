import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenKey = 'auth_token';
  private readonly baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(this.baseUrl).pipe(
      map((users) => {
        const matched = users.find(
          u => u.email === email && u.password === password
        );


        if (matched) {
          const fakeToken = 'fake-jwt-token';
          localStorage.setItem(this.tokenKey, fakeToken);
          return true;
        }
        return false;
      })
    );
  }



  signup(user: Omit<User, 'id'>): Observable<User> {
    const payload: User = {
      id: Date.now().toString(), ...user
    };
    return this.http.post<User>(this.baseUrl, payload);
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<User[]>(this.baseUrl).pipe(
      map(users => users.some(u => u.email === email))
    );
  }


  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
