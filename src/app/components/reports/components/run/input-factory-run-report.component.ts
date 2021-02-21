import { Variable } from './../../../variable/shared/variable.model';
import { Component, Input } from "@angular/core";
import { Report } from '../../shared/report.model';

@Component({
  selector: 'input-factory-run-report',
  template: `
    <select-input-run-report *ngIf="variable.type === 'select'" [report]="report" [variable]="variable">
    </select-input-run-report>
    <multiple-select-input-run-report *ngIf="variable.type === 'multipleSelect'" [report]="report" [variable]="variable">
    </multiple-select-input-run-report>
    <period-input-run-report *ngIf="variable.type === 'period'" [report]="report" [variable]="variable">
    </period-input-run-report>
  `
})
export class InputFactoryRunReportComponent {
  @Input() report: Report;
  @Input() variable: Variable;
}