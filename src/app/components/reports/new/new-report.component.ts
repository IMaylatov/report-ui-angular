import { Component } from '@angular/core';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { Template } from '../shared/template.model';
import { Location } from '@angular/common';
import { of, forkJoin } from 'rxjs';
import { TemplateService } from '../shared/template.service';
import { NotificationService } from 'src/app/shared/service/notification.service';
import { BackdropService } from 'src/app/shared/service/backdrop.service';

@Component({
  selector: 'new-report',
  templateUrl: './new-report.component.html',
  styleUrls: ['./new-report.component.scss']
})
export class NewReportComponent {
  report: Report = {
    id: 0,
    name: 'Новый отчет',
    authorId: '',
    dataSets: [],
    dataSources: [],
    variables: [],
    guid: uuidv4(),
    accessRoles: [],
    accessUsers: []
  };
  templates: Template[] = [];

  constructor(private authService: AuthService,
    private reportService: ReportService,
    public templateService: TemplateService,
    private notificationService: NotificationService,
    public backdropService: BackdropService,
    private location: Location){ }

  ngOnInit(): void {
    this.authService.getUser()
      .then(user => this.report.authorId = user.profile.sub);
  }

  onSave() {
    this.backdropService.open();

    this.reportService.addReport(this.report)
      .pipe(
        switchMap(report => {
          this.report.id = report.id;
          this.location.go(`/reports/${this.report.id}`);
          return this.templates.length > 0
            ? forkJoin(
              this.templates.map(template => 
                this.templateService.addTemplate(report.id, template)
                .pipe(
                  catchError(err => {
                    this.notificationService.showError(`Ошибка добавления шаблона отчета. ${err.error.message}`);
                    return of(null);
                  })
                ))
            )
            : of(null);
        }),
        finalize(() => this.backdropService.close())
      )
      .subscribe(res => {});
  }
}