import { forkJoin } from 'rxjs';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import { RoleService } from '../shared/role.service';
import { Role } from '../shared/role.model';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'access-settings-dialog-report',
  templateUrl: './access-settings-dialog-report.component.html',
  styleUrls: ['./access-settings-dialog-report.component.scss']
})
export class AccessSettingsDialogReportComponent implements OnInit {
  user: User;
  accessUsers: User[] = [];
  
  sourceRoles: Role[] = [];
  
  searchControl = new FormControl();
  roles: Role[] = [];

  constructor(public dialogRef: MatDialogRef<AccessSettingsDialogReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { guid: string, authorId: string, accessRoles: string[], accessUsers: string[] },
    private userService: UserService,
    private roleService: RoleService) { 
    }

  ngOnInit(): void { 
    
    this.userService.getUserById(this.data.authorId)
      .subscribe(user => this.user = user);

    forkJoin(
      this.data.accessUsers.map(userId => this.userService.getUserById(userId))
    ).subscribe(users => this.accessUsers = users);

    this.roleService.getRoles()
      .subscribe(roles => {
        this.sourceRoles = roles;
        this.roles = roles.filter(role => !this.data.accessRoles.some(r => r === role.name));
      });

    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterRole(value))
      ).subscribe(res => {
        this.roles = res;
        console.log(res);
      });
  }

  onSelectedUserOrRole(option) {
    this.data.accessRoles = [...this.data.accessRoles, option.name];
    this.searchControl.reset();
  }

  filterRole(value: string): Role[] {
    if (value) {
      return this.sourceRoles
        .filter(role => !this.data.accessRoles.some(r => r === role.name))
        .filter(role => role.name.includes(value));
    }

    return this.sourceRoles;
  }

  onSubmit(form: any) {
    console.log(form);
  }
}
