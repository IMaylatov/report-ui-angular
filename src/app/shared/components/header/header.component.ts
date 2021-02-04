import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../../core/authentication/auth.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public userName: string = '';

  constructor(private authService: AuthService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) { 
    this.matIconRegistry.addSvgIcon(
      "logo",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../assets/logo.svg")
    );
  }

  ngOnInit(): void {
    this.authService.getUser()
      .then(user => this.userName = user.profile.name);
  }

  onLogoutClick(): void {
    this.authService.logout();
  }
}