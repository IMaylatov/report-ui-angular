import { forkJoin, Observable } from 'rxjs';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import { RoleService } from '../shared/role.service';
import { Role } from '../shared/role.model';
import { FormControl } from '@angular/forms';
import { finalize, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'access-settings-dialog-report',
  templateUrl: './access-settings-dialog-report.component.html',
  styleUrls: ['./access-settings-dialog-report.component.scss']
})
export class AccessSettingsDialogReportComponent implements OnInit {
  guid; string;
  user: User;
  accessUsers: User[] = [];
  accessRoles: string[] = [];

  isLoading: boolean = false;
  
  roles: Role[] = [];
  users: User[] = [];
  
  searchControl = new FormControl();
  filteredRoles: string[] = [];
  filteredUsers: User[] = [];

  constructor(public dialogRef: MatDialogRef<AccessSettingsDialogReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { guid: string, authorId: string, accessRoles: string[], accessUsers: string[] },
    private userService: UserService,
    private roleService: RoleService) { 
    }

  ngOnInit(): void {   
    this.isLoading = true;

    const dataObservables: Observable<any>[] = [
      this.userService.getUserById(this.data.authorId),
      this.roleService.getRoles()
    ];
    if (this.data.accessUsers.length > 0) {
      dataObservables.push(forkJoin(this.data.accessUsers.map(userId => this.userService.getUserById(userId))));
    }

    forkJoin(dataObservables).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(values => {
      this.guid = this.data.guid;
      this.user = values[0];
      this.roles = values[1];
      this.accessUsers = this.data.accessUsers.length > 0 ? values[2] : [];
      this.accessRoles = this.data.accessRoles;

      this.searchControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this.roles.filter(role => role.name.includes(value)).slice(0, 5))
        ).subscribe(roles => this.filteredRoles = roles.map(x => x.name));
      this.searchControl.valueChanges
        .pipe(
          startWith(''),
          switchMap(value => this.userService.getUsers(value, 5))
        ).subscribe(users => this.filteredUsers = users);
    });
  }

  onSelectedUserOrRole(option) {
    switch(option.type) {
      case 'role':
        if (!this.accessRoles.some(x => x === option.value)) {
          this.accessRoles = [...this.accessRoles, option.value];
        }
        break;
      case 'user':
        if (!this.accessUsers.some(x => x.id === option.value.id) && this.user.id !== option.value.id) {
          this.accessUsers = [...this.accessUsers, option.value];
        }
        break;
    }    
    this.searchControl.reset();
  }

  onRemoveRole(role: string) {
    const roleIndex = this.accessRoles.indexOf(role);
    this.accessRoles.splice(roleIndex, 1);
  }

  onRemoveUser(user: User) {
    const userIndex = this.accessUsers.findIndex(x => user.id === x.id);
    this.accessUsers.splice(userIndex, 1);
  }

  onSubmit() {
    this.dialogRef.close({
      guid: this.guid,
      accessRoles: this.accessRoles,
      accessUsers: this.accessUsers.map(x => x.id)
    });
  }
}
