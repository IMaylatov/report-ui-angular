import { Component, Input, OnInit } from '@angular/core';
import { Report } from '../../shared/report.model';

@Component({
  selector: 'period-input-run-report',
  template: `
  <div>
    <mat-form-field appearance="fill">
      <mat-label>Начало периода</mat-label>
      <input matInput [matDatepicker]="beginPicker" [(ngModel)]="variable.value.beginDate" required>
      <mat-datepicker-toggle matSuffix [for]="beginPicker"></mat-datepicker-toggle>
      <mat-datepicker #beginPicker></mat-datepicker>
    </mat-form-field>

    <mat-form-field appearance="fill">
      <mat-label>Окончание периода</mat-label>
      <input matInput [matDatepicker]="endPicker" [(ngModel)]="variable.value.endDate" required>
      <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
      <mat-datepicker #endPicker></mat-datepicker>
    </mat-form-field>
  </div>
  `
})
export class PerionInputRunReportComponent {
  @Input() report: Report;
  @Input() variable: any;
}
