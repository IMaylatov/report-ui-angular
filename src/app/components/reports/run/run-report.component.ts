import { NotificationService } from 'src/app/shared/service/notification.service';
import { saveAs } from 'file-saver';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { VariableValue } from '../shared/variable-value.model';
import { BackdropService } from 'src/app/shared/service/backdrop.service';
import { TemplateService } from '../shared/template.service';
import { TemplateItem } from '../shared/template-item.model';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'run-report',
  templateUrl: './run-report.component.html',
  styleUrls: ['./run-report.component.scss']
})
export class RunReportComponent implements OnInit {
  reportId: number;
  report: Report;
  templates: TemplateItem[] = [];
  context: any = {};
  variables: VariableValue[] = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private reportService: ReportService,
    private templateService: TemplateService,
    private notificationService: NotificationService,
    private backdropService: BackdropService) { 
    this.reportId = route.snapshot.params['id'];
  }

  ngOnInit(): void { 
    this.backdropService.open();

    forkJoin([
      this.reportService.getReportById(this.reportId)
        .pipe(
          catchError(err => { 
            this.notificationService.showError(`Ошибка получения отчета`);
            return of(null);
          })
        ),
        this.templateService.getTemplatesByReportId(this.reportId)
        .pipe(
          catchError(err => { 
            this.notificationService.showError(`Ошибка получения шаблонов`);
            return of([]);
          })
        ),
    ])
      .pipe(
        finalize(() => this.backdropService.close())
      )
      .subscribe(([report, templates]) => {
        this.report = report;
        this.variables = this.reportService.getVariableValues(this.report);
        this.templates = templates;
      });
  }

  onCancelClick() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onRunClick(data: { template: any, variableValues: any }) {
    this.backdropService.open();

    this.reportService.runReportByGuid(this.report.guid, data.template.id, { ...this.context, variableValues: data.variableValues })
      .subscribe(data => saveAs(data, `${this.report.name}.xlsx`),
        err => this.notificationService.showError(`Ошибка формирования отчета. ${err.error.message}`),
        () => this.backdropService.close());
  }
}
