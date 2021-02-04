import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Report } from '../../shared/report.model';
import { ReportService } from '../../shared/report.service';

@Component({
  selector: 'detail-report',
  templateUrl: './detail-report.component.html',
  styleUrls: ['./detail-report.component.scss']
})
export class DetailReportComponent implements OnInit {
  public reportId: number;
  public report: Report;

  constructor(private activateRoute: ActivatedRoute,
    private reportService: ReportService) { 
    this.reportId = activateRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.reportService.getReportById(this.reportId)
      .subscribe(report => {this.report = report; console.log(report);});
  }
}
