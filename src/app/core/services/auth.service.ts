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

    const randomAvatars = [
      'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=1060&t=st=1698180956~exp=1698181556~hmac=8004aef536e11f2c8dafa47e63ced9449bbc1f66ddea688f30fd95a8239f14ba',
      'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611716.jpg?w=1060&t=st=1698180968~exp=1698181568~hmac=3e5f2e64c0b094ae3c4ae4236ee3a8c3ec3b9309dced91645933e249aafab664',
      'https://img.freepik.com/free-psd/3d-illustration-person_23-2149436192.jpg?w=1060&t=st=1698180983~exp=1698181583~hmac=05fc1484ea3fbc7b6f2c47e5ac3573fd96b4e879c088454b75b1a0ba133bfd65',
      'https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436185.jpg?w=1060&t=st=1698180995~exp=1698181595~hmac=ff093d335a91ab6d3ab0d57aa5c507d9457dca3ef1c3297c6ebb6cafd1de64de',
      'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611734.jpg?w=1060&t=st=1698181008~exp=1698181608~hmac=10956b5f7eea6fbc80c2f980fc927a7cdfa07824d37fc05cff5a6e022453f681'
    ]
  
    return this.http.get(checkUserUrl).pipe(
      switchMap((response) => {
        if (Array.isArray(response) && response.length === 0) {
          const userData: User = { 
            username: username, 
            email: email, 
            password: password,
            avatar: randomAvatars[Math.floor(Math.random() * 6)],
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

  setCurrentUser(user: User | null) {
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
