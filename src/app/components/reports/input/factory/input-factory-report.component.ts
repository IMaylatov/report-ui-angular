import { Component, Input } from "@angular/core";
import { Report } from '../../shared/report.model';
import { Variable } from "../../shared/variable.model";

@Component({
  selector: 'input-factory-report',
  templateUrl: './input-factory-report.component.html',
  styleUrls: ['./input-factory-report.component.scss']
})
export class InputFactoryReportComponent {
  @Input() report: Report;
  @Input() variable: Variable;
}