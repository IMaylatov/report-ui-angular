import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/configs/constants';
import { TokenService } from 'src/app/core/authentication/token.service';

@Component({
  selector: 'app-signin-host',
  template: `<div></div>`
})
export class SigninHostComponent implements OnInit {
  constructor(private tokenService: TokenService) { }

  ngOnInit(): void {
    sessionStorage.clear();

    const paramsString = window.location.search;
    const params = new URLSearchParams(paramsString);

    var details = {
      'client_id': Constants.clientId,
      'grant_type': 'host',
      'host': params.get('host'),
      'userId': params.get('userId'),
      'userName': params.get('userName')
    };
    if (params.get('roles')) {
      details['roles'] = params.get('roles');
    }

    this.tokenService.connectToken(details)
      .subscribe((res: any) => {
        const profile = {
          host: params.get('host'),
          sub: params.get('userId'),
          name: params.get('userName')
        };
        const user = {
          profile,
          id_token: res.access_token,
          access_token: res.access_token
        };
        sessionStorage.setItem(`host.user:${Constants.idpAuthority}:${Constants.idpAuthority}`, JSON.stringify(user));
    
        window.location.replace(params.get('redirectUri'));
      })
  }
}