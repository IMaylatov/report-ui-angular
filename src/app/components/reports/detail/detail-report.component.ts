import { NotificationService } from 'src/app/shared/service/notification.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { TemplateService } from '../shared/template.service';
import { BackdropService } from 'src/app/shared/service/backdrop.service';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { Template } from '../shared/template.model';

@Component({
  selector: 'detail-report',
  templateUrl: './detail-report.component.html',
  styleUrls: ['./detail-report.component.scss']
})
export class DetailReportComponent implements OnInit {
  public reportId: number;
  public report: Report;
  public templates: Template[] = [];

  private sourceTemplateIds: number[] = [];

  constructor(private activateRoute: ActivatedRoute,
    private reportService: ReportService,
    private templateService: TemplateService,
    private notificationService: NotificationService,
    public backdropService: BackdropService) { 
  }

  ngOnInit(): void {
    this.reportId = this.activateRoute.snapshot.params['id'];

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
              forkJoin(templateItems.map(templateItem => 
                this.templateService.getTemplateData(this.reportId, templateItem.id)
                  .pipe(
                    switchMap(blob => {
                      const template: Template = { id: templateItem.id, type: templateItem.type, data: blob };
                      return of(template);
                    }),
                    catchError(err => {
                      this.notificationService.showError(`Ошибка получения шаблона отчета`);
                      return of(null);
                    })
                  )))
              : of([]);
          }),
          catchError(err => { 
            this.notificationService.showError(`Ошибка получения списка шаблонов отчетов`);
            return of([]);
          })
        )
    ])
      .pipe(
        finalize(() => this.backdropService.close())
      )
      .subscribe(([report, templates]) => {
        this.report = report;
        this.templates = templates;
        this.sourceTemplateIds = this.templates.map(x => x.id);
      });
  }

  onSave() {
    this.backdropService.open();

    this.reportService.updateReport(this.report)
      .pipe(
        switchMap(report => {
          const addTemplates = this.templates.filter(x => !this.sourceTemplateIds.includes(x.id));
          const updateTemplates = this.templates.filter(x => this.sourceTemplateIds.includes(x.id));
          const deleteTemplates = this.sourceTemplateIds.filter(x => !this.templates.some(t => t.id === x));

          const addTemplates$ = forkJoin(
            addTemplates.map(template => 
              this.templateService.addTemplate(report.id, template)
                .pipe(
                  catchError(err => {
                    this.notificationService.showError(`Ошибка добавления шаблона отчета. ${err.error.message}`);
                    return of(null);
                  })
                ))
          );
          const updateTemplates$ = forkJoin(
            updateTemplates.map(template => 
              this.templateService.updateTemplate(report.id, template.id, template)
                .pipe(
                  catchError(err => {
                    this.notificationService.showError(`Ошибка сохранения шаблона отчета. ${err.error.message}`);
                    return of(null);
                  })
                ))
          );
          const deleteTemplates$ = forkJoin(
            deleteTemplates.map(templateId => 
              this.templateService.deleteTemplate(report.id, templateId)
              .pipe(
                catchError(err => {
                  this.notificationService.showError(`Ошибка удаления шаблона отчета. ${err.error.message}`);
                  return of(null);
                })
              ))
          )

          return forkJoin([
              addTemplates$,
              updateTemplates$,
              deleteTemplates$
            ]);
        }),
        finalize(() => this.backdropService.close())
      )
      .subscribe(res => {});
  }
}
