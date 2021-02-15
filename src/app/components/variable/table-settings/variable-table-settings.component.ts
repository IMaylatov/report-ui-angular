import { element } from 'protractor';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'variable-table-settings',
  templateUrl: './variable-table-settings.component.html',
  styleUrls: ['./variable-table-settings.component.scss']
})
export class VariableTableSettingsComponent {
  displayedColumns: string[] = ['field', 'title', 'actions'];
  columns = new MatTableDataSource<{field: '', title: ''}>([]);

  constructor(public dialogRef: MatDialogRef<VariableTableSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public table: any) {
      this.columns.data = table.columns;
    }

  onAddColumnClick() {
    this.columns.data = [...this.columns.data, {field: '', title: ''}];
  }

  onDeleteColumnClick(element) {
    const elementIndex = this.columns.data.indexOf(element);
    this.columns.data.splice(elementIndex, 1);
    this.columns.data = [...this.columns.data];
  }

  onSubmit() {
    this.dialogRef.close({columns: this.columns.data});
  }
}
