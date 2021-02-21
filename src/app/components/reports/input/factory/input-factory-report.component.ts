import { Component, Input } from "@angular/core";
import { Report } from '../../shared/report.model';
import { VARIABLE_TYPE_DATE, VARIABLE_TYPE_MULTIPLE_SELECT, VARIABLE_TYPE_PERIOD, VARIABLE_TYPE_SELECT, VARIABLE_TYPE_STRING } from "../../shared/reportConst";
import { Variable } from "../../shared/variable.model";

@Component({
  selector: 'input-factory-report',
  templateUrl: './input-factory-report.component.html',
  styleUrls: ['./input-factory-report.component.scss']
})
export class InputFactoryReportComponent {
  @Input() report: Report;
  @Input() variable: Variable;
  @Input() context: any;

  variableTypeSelect = VARIABLE_TYPE_SELECT.name;
  variableTypeMultipleSelect = VARIABLE_TYPE_MULTIPLE_SELECT.name;
  variableTypeString = VARIABLE_TYPE_STRING.name;
  variableTypeDate = VARIABLE_TYPE_DATE.name;
  variableTypePeriod = VARIABLE_TYPE_PERIOD.name;
}