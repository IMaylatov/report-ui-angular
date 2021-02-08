import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DATASOURCE_TYPES } from '../reports/shared/reportConst';
import { DataSource } from './shared/data-source.model';

@Component({
  selector: 'data-source',
  templateUrl: 'data-source.component.html',
})
export class DataSourceComponent {
  dataSourceForm: FormGroup;

  dataSourceTypes: string[] = DATASOURCE_TYPES;

  constructor(public dialogRef: MatDialogRef<DataSourceComponent>,
    @Inject(MAT_DIALOG_DATA) public dataSource: DataSource,
    private fb: FormBuilder) {
      this.dataSourceForm = this.fb.group({
        id: [dataSource.id, Validators.required],
        name: [dataSource.name, Validators.required],
        type: [dataSource.type, Validators.required],
        data: [{...dataSource.data}, Validators.required]
      });
    }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.dataSourceForm.valid) {
      this.dialogRef.close(this.dataSourceForm.value);
    } else {
      Object.keys(this.dataSourceForm.controls).forEach(field => { 
        const control = this.dataSourceForm.get(field);          
        control.markAsTouched({ onlySelf: true });     
      });
    }
  }
}