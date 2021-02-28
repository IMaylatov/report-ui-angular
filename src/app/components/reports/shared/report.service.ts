import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { deepCopy } from 'src/app/shared/utils/deep-copy';
import { ReportListItem } from './report-list-item.model';
import { Report } from './report.model';
import { VARIABLE_TYPE_DATE, VARIABLE_TYPE_MULTIPLE_SELECT, VARIABLE_TYPE_PERIOD, VARIABLE_TYPE_SELECT } from './reportConst';
import { Template } from './template.model';
import { VariableValue } from './variable-value.model';

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

  runReport(report: Report, template: Template, context: any) {
    const formData = new FormData();
    
    formData.append('report', JSON.stringify(report));
    formData.append('templateType', template.type);
    formData.append('templateData', template.data);
    formData.append('context', JSON.stringify(context));
  
    return this.http.post('/api/run/report', formData, {responseType: 'blob'});
  }

  runReportByGuid(reportGuid: string, templateId: number, context: any) {
    const formData = new FormData();
    formData.append('templateId', templateId.toString());
    formData.append('context', JSON.stringify(context));
  
    return this.http.post(`/api/run/report/${reportGuid}`, formData, {responseType: 'blob'});
  }

  public getVariableValues(report: Report): VariableValue[] {
    return report.variables.map(x => {
      const variable: any = deepCopy(x);
      switch (variable.type) {
        case VARIABLE_TYPE_SELECT.name:
          variable.value = {};
          break;
        case VARIABLE_TYPE_MULTIPLE_SELECT.name:
          variable.value = [];
          break;
        case VARIABLE_TYPE_DATE.name:
          variable.value = new Date();
          break;
        case VARIABLE_TYPE_PERIOD.name:
          variable.value = { beginDate: new Date(), endDate: new Date()};
          break;
      }
      return variable;
    });
  }
}