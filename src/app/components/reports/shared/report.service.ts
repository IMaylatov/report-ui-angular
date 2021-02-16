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

  addReport(report: Report): Observable<Report> {
    return this.http.post<Report>(`${this.reportUrl}`, report);
  }

  updateReport(report: Report): Observable<Report> {
    return this.http.put<Report>(`${this.reportUrl}/${report.id}`, report);
  }

  deleteReport(report: Report) {
    return this.http.delete(`${this.reportUrl}/${report.id}`);
  }

  runReport(report: Report, template: any, context: any) {
    const formData = new FormData();
    
    formData.append('report', JSON.stringify(report));
    formData.append('template', template.data);
    formData.append('context', JSON.stringify(context));
  
    return this.http.post('/api/run/report', formData, {responseType: 'blob'});
  }
}