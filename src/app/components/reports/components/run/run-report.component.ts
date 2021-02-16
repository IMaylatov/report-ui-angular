import { Template } from "@angular/compiler/src/render3/r3_ast";
import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Report } from "../../shared/report.model";
import { ReportService } from "../../shared/report.service";
import { saveAs } from "file-saver";

@Component({
  selector: 'run-report',
  templateUrl: './run-report.component.html',
  styleUrls: ['./run-report.component.scss']
})
export class RunReportComponent {
  report: Report;
  template: Template;

  constructor(public dialogRef: MatDialogRef<RunReportComponent>,
    private reportService: ReportService,
    @Inject(MAT_DIALOG_DATA) public data: { report: Report, template: Template }) { 
      this.report = data.report;
      this.template = data.template;
    }

  onRunClick(e) {
    e.preventDefault();

    this.reportService.runReport(this.report, this.template, { userId: 1, variableValues: this.report.variables })
      .subscribe(data => saveAs(data, `${this.report.name}.xlsx`));
  }
}