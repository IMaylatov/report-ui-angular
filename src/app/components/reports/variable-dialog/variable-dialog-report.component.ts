import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { deepCopy } from 'src/app/shared/utils/deep-copy';
import { Report } from '../shared/report.model';
import { VARIABLE_TYPES, VARIABLE_TYPE_MULTIPLE_SELECT, VARIABLE_TYPE_SELECT } from '../shared/reportConst';
import { Variable } from '../shared/variable.model';
import { VariableDialogTableSettingsReportComponent } from './table-settings/variable-dialog-table-settings-report.component';

@Component({
  selector: 'variable-dialog-report',
  templateUrl: './variable-dialog-report.component.html',
  styleUrls: ['./variable-dialog-report.component.scss']
})
export class VariableDialogReportComponent {
  variableTypes = VARIABLE_TYPES;
  variableTypeSelect = VARIABLE_TYPE_SELECT.name;
  variableTypeMultipleSelect = VARIABLE_TYPE_MULTIPLE_SELECT.name;
  
  report: Report = null;
  variable: Variable = null;

  constructor(public dialogRef: MatDialogRef<VariableDialogReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { report: Report, item: Variable },
    public dialog: MatDialog) { 
      this.report = data.report;
      this.variable = data.item;
    }
    
  onSubmit(): void {
    this.dialogRef.close(this.variable);
  }

  onVariableTypeChange(type) {
    if (type === this.variableTypeSelect || type === this.variableTypeMultipleSelect) {
      this.variable.data = {
        dataSet: {
          data: {
            dataSourceName: ''
          }
        }
      }
    } else {
      delete this.variable.data;
    }
  }

  onUseTableChange(useTable) {
    if (useTable) {
      this.variable.data.table = {
        columns: []
      };
    } else {
      delete this.variable.data.table;
    }
  }

  onTableSettingClick(e) {
    e.preventDefault();
    
    const dialogRef = this.dialog.open(VariableDialogTableSettingsReportComponent, 
      { width: '700px', data: deepCopy(this.variable.data.table) });
      
    dialogRef.afterClosed().subscribe(table => {
      if (table) {
        this.variable.data.table = table;
      }
    });
  }
}
