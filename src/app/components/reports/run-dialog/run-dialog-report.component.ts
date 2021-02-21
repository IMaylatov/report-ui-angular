import { Template } from "@angular/compiler/src/render3/r3_ast";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { saveAs } from "file-saver";
import { deepCopy } from "src/app/shared/utils/deep-copy";
import { Report } from "../shared/report.model";
import { ReportService } from "../shared/report.service";
import { VARIABLE_TYPE_DATE, VARIABLE_TYPE_MULTIPLE_SELECT, VARIABLE_TYPE_PERIOD, VARIABLE_TYPE_SELECT } from "../shared/reportConst";

@Component({
  selector: 'run-dialog-report',
  templateUrl: './run-dialog-report.component.html',
  styleUrls: ['./run-dialog-report.component.scss']
})
export class RunDialogReportComponent implements OnInit {
  report: Report;
  template: Template;

  variables: any[] = [];

  constructor(public dialogRef: MatDialogRef<RunDialogReportComponent>,
    private reportService: ReportService,
    @Inject(MAT_DIALOG_DATA) public data: { report: Report, template: Template }) { 
      this.report = data.report;
      this.template = data.template;
    }

  ngOnInit(): void {
    this.variables = this.report.variables.map(x => {
      const variable: any = deepCopy(x);
      switch (variable.type) {
        case VARIABLE_TYPE_SELECT.name:
          variable.value = {};
          break;
        case VARIABLE_TYPE_MULTIPLE_SELECT.name:
          variable.value = [];
          break;
        case VARIABLE_TYPE_DATE.name:
          variable.value = new Date();
          break;
        case VARIABLE_TYPE_PERIOD.name:
          variable.value = { beginDate: new Date(), endDate: new Date()};
          break;
      }
      return variable;
    });
  }

  onRunClick(e) {
    e.preventDefault();

    this.reportService.runReport(this.report, this.template, { userId: 1, variableValues: this.variables })
      .subscribe(data => saveAs(data, `${this.report.name}.xlsx`));
  }
}