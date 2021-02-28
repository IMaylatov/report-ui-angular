import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TemplateItem } from './template-item.model';
import { Template } from './template.model';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private reportUrl: string = 'api/reports';

  constructor(private http: HttpClient) { }

  getTemplatesByReportId(reportId: number): Observable<TemplateItem[]> {
    return this.http.get<TemplateItem[]>(`${this.reportUrl}/${reportId}/templates`);
  }

  getTemplateData(reportId: number, templateId: number) {
    return this.http.get(`${this.reportUrl}/${reportId}/templates/${templateId}/data`, {responseType: 'blob'});
  }

  addTemplate(reportId: number, template: Template) {
    const formData = new FormData();
    formData.append('type', template.type);
    formData.append('data', template.data);
  
    return this.http.post(`/api/reports/${reportId}/templates`, formData);
  }

  updateTemplate(reportId: number, templateId: number, template: Template) {
    const formData = new FormData();
    formData.append('type', template.type);
    formData.append('data', template.data);
  
    return this.http.put(`/api/reports/${reportId}/templates/${templateId}`, formData);
  }

  deleteTemplate(reportId: number, templateId: number) {
    return this.http.delete(`/api/reports/${reportId}/templates/${templateId}`);
  }
}