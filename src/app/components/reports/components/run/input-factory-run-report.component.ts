import { Variable } from './../../../variable/shared/variable.model';
import { Component, Input } from "@angular/core";
import { Report } from '../../shared/report.model';

@Component({
  selector: 'input-factory-run-report',
  template: `
    <select-input-run-report *ngIf="variable.type === 'select'" [report]="report" [variable]="variable">
    </select-input-run-report>
  `
})
export class InputFactoryRunReportComponent {
  @Input() report: Report;
  @Input() variable: Variable;
}