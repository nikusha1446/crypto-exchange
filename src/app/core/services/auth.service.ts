import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { BehaviorSubject, Observable, catchError, of, switchMap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) { }

  registerUser(username: string, email: string, password: string): Observable<void> {
    const checkUserUrl = `http://localhost:3000/users?email=${email}`;
  
    return this.http.get(checkUserUrl).pipe(
      switchMap((response) => {
        if (Array.isArray(response) && response.length === 0) {
          const userData: User = { 
            username: username, 
            email: email, 
            password: password,
            balance: {
              'usd-coin': 0,
              'bitcoin': 0,
              'ethereum': 0,
              'binancecoin': 0,
              'ripple': 0,
              'solana': 0,
              'cardano': 0,
            }
           };
          return this.http.post<void>('http://localhost:3000/users', userData);
        } else {
          return throwError(() => 'User with this email already exist!');
        }
      })
    );
  }

  loginUser(email: string, password: string): Observable<User> {
    const checkUserUrl = `http://localhost:3000/users?email=${email}&password=${password}`;

    return this.http.get<User[]>(checkUserUrl).pipe(
      switchMap((response) => {
        
        if (Array.isArray(response) && response.length === 1) {
          this.currentUser = response[0];
          this.setCurrentUser(this.currentUser);
          return of(this.currentUser);
        } else {
          return throwError(() => 'Wrong email or password');
        }
      })
    );
  }

  getCurrentUserObservable(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  private setCurrentUser(user: User | null) {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  logoutUser() {
    this.currentUser = null;
    this.setCurrentUser(null);
  }
  
}
