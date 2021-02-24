import { NotificationService } from 'src/app/shared/service/notification.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { TemplateService } from '../shared/template.service';
import { BackdropService } from 'src/app/shared/service/backdrop.service';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'detail-report',
  templateUrl: './detail-report.component.html',
  styleUrls: ['./detail-report.component.scss']
})
export class DetailReportComponent implements OnInit {
  private emptyTemplate = { id: 0, data: null};

  public reportId: number;
  public report: Report;
  public template: { id: number, data: any } = this.emptyTemplate;

  constructor(private activateRoute: ActivatedRoute,
    private reportService: ReportService,
    private templateService: TemplateService,
    private notificationService: NotificationService,
    public backdropService: BackdropService) { 
    this.reportId = activateRoute.snapshot.params['id'];
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
          switchMap(templateItems => {
            return templateItems.length > 0 ?
              this.templateService.getTemplateData(this.reportId, templateItems[0].id)
                .pipe(
                  switchMap(blob => of({ id: templateItems[0].id, data: blob })),
                  catchError(err => {
                    this.notificationService.showError(`Ошибка получения шаблона отчета`);
                    return of(this.emptyTemplate);
                  })
                )
              : of(this.emptyTemplate);
          }),
          catchError(err => { 
            this.notificationService.showError(`Ошибка получения списка шаблонов отчетов`);
            return of(this.emptyTemplate);
          })
        )
    ])
      .pipe(
        finalize(() => this.backdropService.close())
      )
      .subscribe(([report, template]) => {
        this.report = report;
        this.template = template;
      });
  }
}
