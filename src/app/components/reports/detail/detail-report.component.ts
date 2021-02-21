import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { TemplateService } from '../shared/template.service';

@Component({
  selector: 'detail-report',
  templateUrl: './detail-report.component.html',
  styleUrls: ['./detail-report.component.scss']
})
export class DetailReportComponent implements OnInit {
  public reportId: number;
  public report: Report;
  public template: { id: number, data: any } = { id: 0, data: null};

  constructor(private activateRoute: ActivatedRoute,
    private reportService: ReportService,
    private templateService: TemplateService) { 
    this.reportId = activateRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.reportService.getReportById(this.reportId)
      .subscribe(report => this.report = report);

    this.templateService.getTemplatesByReportId(this.reportId)
      .subscribe(templateItems => {
        if (templateItems.length > 0) {
          this.templateService.getTemplateData(this.reportId, templateItems[0].id)
            .subscribe(blob => this.template = { id: templateItems[0].id, data: blob });
        }
      })
  }
}
