import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { BehaviorSubject, Observable, catchError, of, switchMap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private currentUser: User | null = null;
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) { }

  registerUser(username: string, email: string, password: string): Observable<void> {
    const checkUserUrl = `http://localhost:3000/users?email=${email}`;

    const randomAvatars = [
      'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671126.jpg?w=1060&t=st=1698187090~exp=1698187690~hmac=2637e758889011c3c8c2189744e5c4eba24c2427b023d8d3d7d8671b44d9e6b5',
      'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?w=1060&t=st=1698186893~exp=1698187493~hmac=8e3b162e6c7db60360c1e405581de64cd1008f5f981213584ba8b148be317b90',
      'https://img.freepik.com/free-psd/3d-illustration-person_23-2149436192.jpg?w=1060&t=st=1698180983~exp=1698181583~hmac=05fc1484ea3fbc7b6f2c47e5ac3573fd96b4e879c088454b75b1a0ba133bfd65',
      'https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436185.jpg?w=1060&t=st=1698180995~exp=1698181595~hmac=ff093d335a91ab6d3ab0d57aa5c507d9457dca3ef1c3297c6ebb6cafd1de64de',
      'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611746.jpg?w=1060&t=st=1698186939~exp=1698187539~hmac=9b8120e8b97b50e00bcd1b0544024cfcb2e07fe5c302eab82334ae4ca63afd29'
    ]
  
    return this.http.get(checkUserUrl).pipe(
      switchMap((response) => {
        if (Array.isArray(response) && response.length === 0) {
          const userData: User = { 
            username: username, 
            email: email, 
            password: password,
            avatar: randomAvatars[Math.floor(Math.random() * 5)],
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
          this.isAuthenticated = true;
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

  setCurrentUser(user: User | null) {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  logoutUser() {
    this.isAuthenticated = false;
    this.currentUser = null;
    this.setCurrentUser(null);
  }

  isUserAuthenticated() {
    return this.isAuthenticated;
  }
  
}
