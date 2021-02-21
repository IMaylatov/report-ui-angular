import { Component, Input } from '@angular/core';
import { Report } from '../../shared/report.model';

@Component({
  selector: 'period-input-report',
  templateUrl: './period-input-report.component.html',
  styleUrls: ['./period-input-report.component.scss']
})
export class PerionInputReportComponent {
  @Input() report: Report;
  @Input() variable: any;
}
