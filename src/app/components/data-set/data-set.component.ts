import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Report } from '../reports/shared/report.model';
import { DATASET_TYPES } from '../reports/shared/reportConst';
import { DataSet } from './shared/data-set.model';

@Component({
  selector: 'data-set',
  templateUrl: './data-set.component.html',
  styleUrls: ['./data-set.component.scss']
})
export class DataSetComponent {
  dataSetTypes = DATASET_TYPES; 
   
  report: Report = null;
  dataSet: DataSet = null;

  constructor(public dialogRef: MatDialogRef<DataSetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { report: Report, item: DataSet }) { 
      this.report = data.report;
      this.dataSet = data.item;
    }
  
  onSubmit(dataSet: any): void {
    this.dialogRef.close(dataSet);
  }
}
