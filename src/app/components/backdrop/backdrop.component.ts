import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.scss']
})
export class BackdropComponent {
  constructor(public dialogRef: MatDialogRef<BackdropComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
}
