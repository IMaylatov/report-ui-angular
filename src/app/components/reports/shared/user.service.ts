import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl: string = 'api/users';

  constructor(private http: HttpClient) { }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${userId}`);
  }

  getUsers(name: string, take: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.userUrl}?name=${name}${take ? `&take=${take}` : ""}`);
  }
}