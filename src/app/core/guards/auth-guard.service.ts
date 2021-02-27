import { AuthService } from '../authentication/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private _authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const roles = route.data['roles'] as Array<string>;
    if(!roles) {
      return this.checkIsUserAuthenticated();
    }
    else {
      return this.checkForAdministrator();
    }
  }

  private checkIsUserAuthenticated() {
    return this._authService.isAuthenticated()
      .then(res => {
        return res ? true : this.redirectToUnauthorized();
      });
  }

  private checkForAdministrator() {
    return this._authService.checkIfUserIsAdmin()
      .then(res => {
        return res ? true : this.redirectToUnauthorized();
      });
  }

  private redirectToUnauthorized() {
    this._authService.login();
    return false;
  }
}