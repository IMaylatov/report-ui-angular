import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ReportListItem } from './shared/report-list-item.model';
import { ReportService } from './shared/report.service';
import { NotificationService } from 'src/app/shared/service/notification.service';

@Component({
  selector: 'reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, AfterViewInit { 
  displayedColumns: string[] = ['name', 'type', 'actions'];
  reports = new MatTableDataSource<ReportListItem>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private reportService: ReportService,
    private notificationService: NotificationService) { 
  }

  ngOnInit(): void {
    this.getReports();
  }

  ngAfterViewInit() {
    this.reports.paginator = this.paginator;
    this.reports.sort = this.sort;
  }

  getReports() {
    this.reportService.getReports()
      .subscribe(
        reports => this.reports.data = reports,
        err => this.notificationService.showError(`Ошибка получения списка отчетов. ${err.error.message}`));
  }

  onDeleteReportClick(report) {
    this.reportService.deleteReport(report)
      .subscribe(() => {
        const reportIndex = this.reports.data.indexOf(report);
        this.reports.data.splice(reportIndex, 1);
      },
      err => this.notificationService.showError(`Ошибка удаления отчета. ${err.error.message}`));
  }

  doFilter(value: string) {
    this.reports.filter = value.trim().toLocaleLowerCase();
  }
}