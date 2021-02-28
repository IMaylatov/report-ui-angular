import { NotificationService } from 'src/app/shared/service/notification.service';
import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { saveAs } from "file-saver"
import { Report } from "../shared/report.model";
import { ReportService } from "../shared/report.service";
import { BackdropService } from 'src/app/shared/service/backdrop.service';
import { Template } from '../shared/template.model';
import { TemplateItem } from '../shared/template-item.model';

@Component({
  selector: 'run-dialog-report',
  templateUrl: './run-dialog-report.component.html',
  styleUrls: ['./run-dialog-report.component.scss']
})
export class RunDialogReportComponent {
  report: Report;
  templates: TemplateItem[] = [];
  context: any = {};

  constructor(public dialogRef: MatDialogRef<RunDialogReportComponent>,
    private reportService: ReportService,
    @Inject(MAT_DIALOG_DATA) public data: { report: Report, templates: Template[] },
    private notificationService: NotificationService,
    private backdropService: BackdropService) { 
      this.report = data.report;
      this.templates = data.templates.map(template => { return { id: template.id, type: template.type, reportId: this.report.id } });
    }

  onCancelClick() {
    this.dialogRef.close();
  }

  onRunClick(data: { template: any, variableValues: any }) {
    this.backdropService.open();

    const selectedTemplate = this.data.templates.find(x => x.id === data.template.id);
    this.reportService.runReport(this.report, selectedTemplate, { ...this.context, variableValues: data.variableValues })
      .subscribe(data => saveAs(data, `${this.report.name}.xlsx`),
        err => this.notificationService.showError(`Ошибка формирования отчета. ${err.error.message}`),
        () => this.backdropService.close());
  }
}