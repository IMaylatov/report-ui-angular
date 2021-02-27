import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from 'src/app/configs/constants';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private http: HttpClient) { }

  public connectToken(details) {
    const params = new HttpParams({ fromObject: details });
  
    return this.http.post(`${Constants.idpAuthority}/connect/token`, 
      params, 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }
    );  
  }
}