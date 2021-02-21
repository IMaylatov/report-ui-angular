import { saveAs } from 'file-saver';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { VariableValue } from '../shared/variable-value.model';

@Component({
  selector: 'run-report',
  templateUrl: './run-report.component.html',
  styleUrls: ['./run-report.component.scss']
})
export class RunReportComponent implements OnInit {
  reportId: number;
  report: Report;

  variables: VariableValue[] = [];

  constructor(private activateRoute: ActivatedRoute,
    private reportService: ReportService) { 
    this.reportId = activateRoute.snapshot.params['id'];
  }

  ngOnInit(): void { 
    this.reportService.getReportById(this.reportId)
      .subscribe(report => {
        this.report = report;
        this.variables = this.reportService.getVariableValues(this.report);
      });
  }

  onRunClick() {
    const variableValues = this.variables.map(x => {
      return {
        name: x.name,
        value: x.value
      }
    });
    this.reportService.runReportByGuid(this.report.guid, { userId: 1, variableValues: variableValues })
      .subscribe(data => saveAs(data, `${this.report.name}.xlsx`));
  }
}
