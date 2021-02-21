import { saveAs } from 'file-saver';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  context: any = {};
  variables: VariableValue[] = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private reportService: ReportService) { 
    this.reportId = route.snapshot.params['id'];
  }

  ngOnInit(): void { 
    this.reportService.getReportById(this.reportId)
      .subscribe(report => {
        this.report = report;
        this.variables = this.reportService.getVariableValues(this.report);
      });
  }

  onCancelClick() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onRunClick(variableValues) {
    this.reportService.runReportByGuid(this.report.guid, { ...this.context, variableValues })
      .subscribe(data => saveAs(data, `${this.report.name}.xlsx`));
  }
}
