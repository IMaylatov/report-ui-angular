import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportListItem } from './report-list-item.model';
import { Report } from './report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private reportUrl: string = 'api/reports';

  constructor(private http: HttpClient) { }

  getReports(): Observable<ReportListItem[]> {
    return this.http.get<ReportListItem[]>(`${this.reportUrl}`);
  }

  getReportById(reportId: number): Observable<Report> {
    return this.http.get<Report>(`${this.reportUrl}/${reportId}`);
  }
}