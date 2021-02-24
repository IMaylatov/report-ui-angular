import { NotificationService } from 'src/app/shared/service/notification.service';
import { saveAs } from 'file-saver';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { VariableValue } from '../shared/variable-value.model';
import { BackdropService } from 'src/app/shared/service/backdrop.service';

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
    private reportService: ReportService,
    private notificationService: NotificationService,
    private backdropService: BackdropService) { 
    this.reportId = route.snapshot.params['id'];
  }

  ngOnInit(): void { 
    this.backdropService.open();

    this.reportService.getReportById(this.reportId)
      .subscribe(report => {
        this.report = report;
        this.variables = this.reportService.getVariableValues(this.report);
      },
      err => this.notificationService.showError(`Ошибка получения отчета. ${err.error.message}`),
      () => this.backdropService.close());
  }

  onCancelClick() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onRunClick(variableValues) {
    this.backdropService.open();

    this.reportService.runReportByGuid(this.report.guid, { ...this.context, variableValues })
      .subscribe(data => saveAs(data, `${this.report.name}.xlsx`),
        err => this.notificationService.showError(`Ошибка формирования отчета. ${err.error.message}`),
        () => this.backdropService.close());
  }
}
