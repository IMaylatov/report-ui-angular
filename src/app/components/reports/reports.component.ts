import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ReportListItem } from './shared/report-list-item.model';
import { ReportService } from './shared/report.service';

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

  constructor(private reportService: ReportService) { 
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
      .subscribe(reports => this.reports.data = reports);
  }

  onDeleteReportClick(report) {
    this.reportService.deleteReport(report)
      .subscribe(() => {
        const reportIndex = this.reports.data.indexOf(report);
        this.reports.data.splice(reportIndex, 1);
      });
  }

  doFilter(value: string) {
    this.reports.filter = value.trim().toLocaleLowerCase();
  }
}