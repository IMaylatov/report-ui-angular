import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { Report } from '../shared/report.model';
import { REPORT_TYPE_CLOSEDXML, REPORT_TYPE_MALIBU } from '../shared/reportConst';

@Component({
  selector: 'new-report',
  templateUrl: './new-report.component.html',
  styleUrls: ['./new-report.component.scss']
})
export class NewReportComponent {
  report: Report = {
    id: 0,
    name: 'Новый отчет',
    type: '',
    authorId: '',
    dataSets: [],
    dataSources: [],
    variables: [],
    guid: uuidv4(),
    accessRoles: [],
    accessUsers: []
  };
  template = { id: 0, data: null };

  constructor(private authService: AuthService){ }

  ngOnInit(): void {
    this.authService.getUser()
      .then(user => this.report.authorId = user.profile.sub);
  }

  onClosedXmlClick() {
    this.report.type = REPORT_TYPE_CLOSEDXML;
  }

  onMalibuClick() {
    this.report.dataSources.push({
      id: 0,
      name: 'DataSource',
      type: 'msSql',
      data: {}
    });
    this.report.type = REPORT_TYPE_MALIBU;
  }
}