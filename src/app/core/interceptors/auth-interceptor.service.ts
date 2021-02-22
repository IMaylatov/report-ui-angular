import { Router } from '@angular/router';
import { AuthService } from '../authentication/auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private _authService: AuthService, private _router: Router) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(
      this._authService.getAccessToken()
        .then(token => {
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          const authRequest = req.clone({ headers });
          return next.handle(authRequest)
          .pipe(
            catchError((err: HttpErrorResponse) => {
              if(err && (err.status === 401 || err.status === 403)){
                this._router.navigate(['/unauthorized']);
              }
              throw err;
            })
          ).toPromise();
        })
    );
  }
}