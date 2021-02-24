import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BackdropComponent } from 'src/app/components/backdrop/backdrop.component';

@Injectable({
  providedIn: 'root'
})
export class BackdropService {
  dialogRef: MatDialogRef<BackdropComponent, any>;

  constructor(public dialog: MatDialog) { }

  open() {
    this.dialogRef = this.dialog.open(BackdropComponent, 
      { disableClose: true });
  }

  close() {
    this.dialogRef.close();
  }
}