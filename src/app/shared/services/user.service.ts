import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Fields } from '../interfaces/fields';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  changeUserFields(userId: number | undefined, fields: Fields) {
    return this.http.patch(`http://localhost:3000/users/${userId}`, fields);
  }
}
