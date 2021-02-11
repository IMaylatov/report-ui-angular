import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Report } from '../reports/shared/report.model';
import { VARIABLE_TYPES, VARIABLE_TYPE_MULTIPLE_SELECT, VARIABLE_TYPE_SELECT } from '../reports/shared/reportConst';
import { Variable } from './shared/variable.model';

@Component({
  selector: 'variable',
  templateUrl: './variable.component.html',
  styleUrls: ['./variable.component.scss']
})
export class VariableComponent {
  variableTypes = VARIABLE_TYPES;
  variableTypeSelect = VARIABLE_TYPE_SELECT.name;
  variableTypeMultipleSelect = VARIABLE_TYPE_MULTIPLE_SELECT.name;
  
  report: Report = null;
  variable: Variable = null;

  constructor(public dialogRef: MatDialogRef<VariableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { report: Report, item: Variable }) { 
      this.report = data.report;
      this.variable = data.item;
    }
    
  onSubmit(variable: any): void {
    this.dialogRef.close(variable);
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

  onTableSettingClick(e) {
    e.preventDefault();
    console.log('table');
  }
}
