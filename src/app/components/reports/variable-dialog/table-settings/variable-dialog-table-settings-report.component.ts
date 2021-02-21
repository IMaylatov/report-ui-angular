import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'variable-dialog-table-settings-report',
  templateUrl: './variable-dialog-table-settings-report.component.html',
  styleUrls: ['./variable-dialog-table-settings-report.component.scss']
})
export class VariableDialogTableSettingsReportComponent {
  displayedColumns: string[] = ['field', 'title', 'actions'];
  columns = new MatTableDataSource<{field: '', title: ''}>([]);

  constructor(public dialogRef: MatDialogRef<VariableDialogTableSettingsReportComponent>,
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
