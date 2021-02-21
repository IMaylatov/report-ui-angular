import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Report } from '../shared/report.model';
import { DATASET_TYPES } from '../shared/reportConst';
import { DataSet } from '../shared/data-set.model';

@Component({
  selector: 'data-set-dialog-report',
  templateUrl: './data-set-dialog-report.component.html',
  styleUrls: ['./data-set-dialog-report.component.scss']
})
export class DataSetDialogReportComponent {
  dataSetTypes = DATASET_TYPES; 
   
  report: Report = null;
  dataSet: DataSet = null;

  constructor(public dialogRef: MatDialogRef<DataSetDialogReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { report: Report, item: DataSet }) { 
      this.report = data.report;
      this.dataSet = data.item;
    }
  
  onSubmit(dataSet: any): void {
    this.dialogRef.close(dataSet);
  }
}
