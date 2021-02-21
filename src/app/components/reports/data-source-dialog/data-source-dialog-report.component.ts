import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataSource } from '../shared/data-source.model';
import { Report } from '../shared/report.model';
import { CONNECTION_TYPES, CONNECTION_TYPE_CONNECTION_STRING, DATASOURCE_TYPES } from '../shared/reportConst';

@Component({
  selector: 'data-source-dialog-report',
  templateUrl: './data-source-dialog-report.component.html',
  styleUrls: ['./data-source-dialog-report.component.scss']
})
export class DataSourceDialogReportComponent {
  dataSourceTypes: string[] = DATASOURCE_TYPES;
  connectionTypes = CONNECTION_TYPES;
  connectionTypeConnectionString = CONNECTION_TYPE_CONNECTION_STRING.name;
   
  report: Report = null;
  dataSource: DataSource = null;

  constructor(public dialogRef: MatDialogRef<DataSourceDialogReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { report: Report, item: DataSource } ) { 
      this.report = data.report;
      this.dataSource = data.item;
    }

  onSubmit(dataSource: any): void {
    this.dialogRef.close(dataSource);
  }
}