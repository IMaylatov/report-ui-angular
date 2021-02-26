import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ReportListItem } from './shared/report-list-item.model';
import { ReportService } from './shared/report.service';
import { NotificationService } from 'src/app/shared/service/notification.service';
import { BackdropService } from 'src/app/shared/service/backdrop.service';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/core/authentication/auth.service';

@Component({
  selector: 'reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, AfterViewInit { 
  displayedColumns: string[] = ['name', 'type', 'run'];
  reports = new MatTableDataSource<ReportListItem>([]);
  isLoading: boolean = false;

  userIsAdmin: boolean = false;

  searchControl = new FormControl();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public backdropService: BackdropService,
    private reportService: ReportService,
    private notificationService: NotificationService,
    private authService: AuthService) { 
  }

  ngOnInit(): void {
    this.authService.checkIfUserIsAdmin()
      .then(userIsAdmin => {
        this.userIsAdmin = userIsAdmin;
        if (userIsAdmin) {
          this.displayedColumns = ['name', 'type', 'run', 'actions'];
        } else {
          this.displayedColumns = ['name', 'run'];
        }
      })

    this.getReports();

    this.searchControl.valueChanges
      .subscribe(value => this.reports.filter = value);
  }

  ngAfterViewInit() {
    this.reports.paginator = this.paginator;
    this.reports.sort = this.sort;
  }

  getReports() {
    this.isLoading = true;
    this.reportService.getReports()
      .subscribe(
        reports => this.reports.data = reports,
        err => this.notificationService.showError(`Ошибка получения списка отчетов. ${err.error.message}`),
        () => this.isLoading = false);
  }

  onDeleteReportClick(report) {
    this.backdropService.open();
      
    this.reportService.deleteReport(report)
      .subscribe(() => {
        const reportIndex = this.reports.data.indexOf(report);
        this.reports.data.splice(reportIndex, 1);
        this.reports._updateChangeSubscription();
      },
      err => this.notificationService.showError(`Ошибка удаления отчета. ${err.error.message}`),
      () => this.backdropService.close());
  }
}