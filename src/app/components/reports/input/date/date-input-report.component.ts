import { Component, Input } from '@angular/core';
import { Report } from '../../shared/report.model';
import { VariableValue } from '../../shared/variable-value.model';

@Component({
  selector: 'date-input-report',
  templateUrl: './date-input-report.component.html',
  styleUrls: ['./date-input-report.component.scss']
})
export class DateInputReportComponent {
  @Input() report: Report;
  @Input() variable: VariableValue;
}
