import { saveAs } from 'file-saver';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { VariableValue } from '../shared/variable-value.model';
import { CONNECTION_TYPE_HOST } from '../shared/reportConst';

@Component({
  selector: 'run-report',
  templateUrl: './run-report.component.html',
  styleUrls: ['./run-report.component.scss']
})
export class RunReportComponent implements OnInit {
  reportId: number;
  report: Report;
  context: any = {};

  isNeedHost: boolean = false;

  variables: VariableValue[] = [];

  constructor(private activateRoute: ActivatedRoute,
    private reportService: ReportService) { 
    this.reportId = activateRoute.snapshot.params['id'];
  }

  ngOnInit(): void { 
    this.reportService.getReportById(this.reportId)
      .subscribe(report => {
        this.report = report;

        const isNeedHost = report.dataSources.some(x => x.data.connectionType === CONNECTION_TYPE_HOST.name);
        if (isNeedHost) {
          this.context.host = '';
          this.isNeedHost = isNeedHost;
        }

        this.variables = this.reportService.getVariableValues(this.report);
      });
  }

  onRunClick() {
    this.context.variableValues = this.variables.map(x => {
      return {
        name: x.name,
        value: x.value
      }
    });
    this.reportService.runReportByGuid(this.report.guid, this.context)
      .subscribe(data => saveAs(data, `${this.report.name}.xlsx`));
  }

  onHostNextClick() {
    this.isNeedHost = false;
  }
}
