import { Component } from '@angular/core';
import { Report } from '../../shared/report.model';
import { REPORT_TYPE_CLOSEDXML, REPORT_TYPE_MALIBU } from '../../shared/reportConst';

@Component({
  selector: 'new-report',
  templateUrl: './new-report.component.html',
  styleUrls: ['./new-report.component.scss']
})
export class NewReportComponent {
  public report: Report = {
    id: 0,
    name: 'Новый отчет',
    type: '',
    authorId: '',
    dataSets: [],
    dataSources: [],
    variables: [],
    guid: '',
    accessRoles: [],
    accessUsers: []
  };

  onClosedXmlClick() {
    this.report.type = REPORT_TYPE_CLOSEDXML;
  }

  onMalibuClick() {
    this.report.type = REPORT_TYPE_MALIBU;
  }
}