import { ReportService } from './../shared/report.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Report } from '../shared/report.model';
import { VariableValue } from '../shared/variable-value.model';
import { CONNECTION_TYPE_HOST } from '../shared/reportConst';

@Component({
  selector: 'run-form-report',
  templateUrl: './run-form-report.component.html',
  styleUrls: ['./run-form-report.component.scss']
})
export class RunFormReportComponent implements OnInit {
  @Input() report: Report;
  @Input() context: any;

  @Output() cancelClick: EventEmitter<any> = new EventEmitter();
  @Output() runClick: EventEmitter<any> = new EventEmitter();

  variables: VariableValue[];

  isNeedHost: boolean = false;

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    const isNeedHost = this.report.dataSources.some(x => x.data.connectionType === CONNECTION_TYPE_HOST.name);
    if (isNeedHost) {
      this.context.host = '';
      this.isNeedHost = isNeedHost;
    }

    this.variables = this.reportService.getVariableValues(this.report);
  }

  onHostNextClick() {
    this.isNeedHost = false;
  }

  onCancelClick() {
    this.cancelClick.emit();
  }

  onRunClick(e) {
    this.runClick.emit(this.variables);
  }
}
