import { Injectable } from '@angular/core';
import { UserManager, User, UserManagerSettings } from 'oidc-client';
import { Constants } from '../../configs/constants';
import { of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userManager: UserManager;
  private _user: User;
  private _loginChangedSubject = new Subject<boolean>();

  public loginChanged = this._loginChangedSubject.asObservable();

  private get idpSettings() : UserManagerSettings {
    return {
      authority: Constants.idpAuthority,
      client_id: Constants.clientId,
      redirect_uri: `${Constants.clientRoot}/signin-callback`,
      scope: "openid profile softrust_report_api",
      response_type: "code",
      post_logout_redirect_uri: `${Constants.clientRoot}/signout-callback`
    }
  }

  constructor() { 
    this._userManager = new UserManager(this.idpSettings);

    this._userManager.events.addAccessTokenExpired(() => {
      this._userManager.signinSilent();
    });
  }

  public login = () => {
    return this._userManager.signinRedirect();
  }

  public isAuthenticated = (): Promise<boolean> => {    
    const user = this.getHostUser();
    if (user) {
      return of(true).toPromise();
    }

    return this._userManager.getUser()
    .then(user => {
      if(this._user !== user){
        this._loginChangedSubject.next(this.checkUser(user));
      }

      this._user = user;

      return this.checkUser(user);
    })
  }

  public finishLogin = (): Promise<User> => {
    return this._userManager.signinRedirectCallback()
    .then(user => {
      this._user = user;
      this._loginChangedSubject.next(this.checkUser(user));
      return user;
    })
  }

  public logout = () => {
    sessionStorage.clear();
    this._userManager.signoutRedirect();
  }

  public finishLogout = () => {
    this._user = null;
    return this._userManager.signoutRedirectCallback();
  }

  public getAccessToken = (): Promise<string> => {
    const user = this.getHostUser();
    if (user) {
      return of(user.access_token).toPromise();
    }

    return this._userManager.getUser()
    .then(user => {
      return !!user && !user.expired ? user.access_token : null;
    })
  }

  public checkIfUserIsAdmin = (): Promise<boolean> => {
    return this._userManager.getUser()
    .then(user => {
      return user?.profile.role === 'admin' || user?.profile.role.includes('admin');
    })
  }

  public getUser = (): Promise<User> => {  
    const user = this.getHostUser();
    if (user) {
      return of(user).toPromise();
    }

    return this._userManager.getUser();
  }

  public getHostUser = () => {
    return JSON.parse(sessionStorage.getItem(`host.user:${Constants.idpAuthority}:${Constants.idpAuthority}`));
  }

  private checkUser = (user : User): boolean => {
    return !!user && !user.expired;
  }
}