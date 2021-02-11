import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Report } from '../reports/shared/report.model';
import { DATASOURCE_TYPES, CONNECTION_TYPES, CONNECTION_TYPE_CONNECTION_STRING } from '../reports/shared/reportConst';
import { DataSource } from './shared/data-source.model';

@Component({
  selector: 'data-source',
  templateUrl: './data-source.component.html',
  styleUrls: ['./data-source.component.scss']
})
export class DataSourceComponent {
  dataSourceTypes: string[] = DATASOURCE_TYPES;
  connectionTypes = CONNECTION_TYPES;
  connectionTypeConnectionString = CONNECTION_TYPE_CONNECTION_STRING.name;
   
  report: Report = null;
  dataSource: DataSource = null;

  constructor(public dialogRef: MatDialogRef<DataSourceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { report: Report, item: DataSource } ) { 
      this.report = data.report;
      this.dataSource = data.item;
    }

  onSubmit(dataSource: any): void {
    this.dialogRef.close(dataSource);
  }
}