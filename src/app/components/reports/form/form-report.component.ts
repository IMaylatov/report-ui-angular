import { switchMap, catchError, finalize } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/service/notification.service';
import { of } from 'rxjs';
import { Location } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { DATASET_TYPE_SQLQUERY, REPORT_TYPE_CLOSEDXML, REPORT_TYPE_MALIBU } from '../shared/reportConst';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { TemplateService } from '../shared/template.service';
import { RunDialogReportComponent } from '../run-dialog/run-dialog-report.component';
import { VariableDialogReportComponent } from '../variable-dialog/variable-dialog-report.component';
import { DataSetDialogReportComponent } from '../data-set-dialog/data-set-dialog-report.component';
import { DataSourceDialogReportComponent } from '../data-source-dialog/data-source-dialog-report.component';
import { deepCopy } from 'src/app/shared/utils/deep-copy';
import { BackdropService } from 'src/app/shared/service/backdrop.service';
import { AccessSettingsDialogReportComponent } from '../access-settings-dialog/access-settings-dialog-report.component';

@Component({
  selector: 'form-report',
  templateUrl: './form-report.component.html',
  styleUrls: ['./form-report.component.scss']
})
export class FormReportComponent {
  reportTypeClosedXml = REPORT_TYPE_CLOSEDXML;
  reportTypeMalibu = REPORT_TYPE_MALIBU;

  @Input() report: Report;
  @Input() template: { id: number, data: any };

  @ViewChild('parameterMenuTrigger')
  contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  
  constructor(public dialog: MatDialog,
    public reportService: ReportService,
    public templateService: TemplateService,
    private notificationService: NotificationService,
    public backdropService: BackdropService,
    private location: Location) { }

  onSave(): void {
    this.backdropService.open();

    let reportOperation = this.report.id === 0
      ? this.reportService.addReport(this.report)
          .pipe(
            switchMap(report => {
              this.report.id = report.id;
              this.location.go(`/reports/${this.report.id}`);
              return of(report);
            })
          )
      : this.reportService.updateReport(this.report);

    reportOperation.pipe(
      switchMap(report => {
        if (this.template.id === 0) {
          if (this.template.data !== null) {
            return this.templateService.addTemplate(report.id, this.template.data)
              .pipe(
                catchError(err => {
                  this.notificationService.showError(`Ошибка добавления шаблона отчета. ${err.error.message}`);
                  return of(report);
                })
              )
          } else {
            return of(report);
          }
        } else {          
          if (this.template.data !== null) {
            return this.templateService.updateTemplate(report.id, this.template.id, this.template.data)
              .pipe(
                catchError(err => {
                  this.notificationService.showError(`Ошибка сохранения шаблона отчета. ${err.error.message}`);
                  return of(report);
                })
              )
          } else {
            return this.templateService.deleteTemplate(report.id, this.template.id)
              .pipe(
                catchError(err => {
                  this.notificationService.showError(`Ошибка удаления шаблона отчета. ${err.error.message}`);
                  return of(report);
                })
              )
          }
        }
      }),
      finalize(() => this.backdropService.close())
    ).subscribe(res => {});
  }

  onRun() {
    const dialogRef = this.dialog.open(RunDialogReportComponent, 
      { width: '600px', data: { report: this.report, template: this.template }});
      
    dialogRef.afterClosed().subscribe(item => {
    });
  }

  onElementAddClick(elemType: string) {
    let modalComponent;
    let modalItem;
    switch (elemType) {
      case 'dataSources': 
        modalComponent = DataSourceDialogReportComponent;
        modalItem = { id: 0, name: '', type: '', data: {}};
        break;
      case 'dataSets': 
        modalComponent = DataSetDialogReportComponent;
        modalItem = { id: 0, name: '', type: DATASET_TYPE_SQLQUERY.name, data: {}};
        break;
      case 'variables': 
        modalComponent = VariableDialogReportComponent;
        modalItem = { id: 0, name: '', label: '', type: '', required: false, data: {}};
        break;      
    }

    const dialogRef = this.dialog.open(modalComponent, 
      { width: '800px', data: { report: this.report, item: modalItem }});
      
    dialogRef.afterClosed().subscribe(item => {
      if (item) {
        this.report[elemType].push(item);
      }
    });
  }

  onContextMenu(event: MouseEvent, elemType: string, item: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { data: { elemType, item }};
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  onElemEditClick(elemType: string, item: any) {
    let modalComponent;
    switch(elemType) {
      case 'dataSources':
        modalComponent = DataSourceDialogReportComponent;
        break;
      case 'dataSets':
        modalComponent = DataSetDialogReportComponent;
        break;
      case 'variables':
        modalComponent = VariableDialogReportComponent;
        break;
    }

    const dialogRef = this.dialog.open(modalComponent, 
      { width: '800px', data: { report: this.report, item: deepCopy(item)} });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const itemIndex = this.report[elemType].indexOf(item);
        this.report[elemType][itemIndex] = result;
      }
    });
  }

  onElemDeleteClick(elemType: string, item: any) {
    const itemIndex = this.report[elemType].indexOf(item);
    this.report[elemType].splice(itemIndex, 1);
  }

  onAccessSettingsClick() {
    const dialogRef = this.dialog.open(AccessSettingsDialogReportComponent, {
      width: '500px', 
      data: deepCopy({ 
        guid: this.report.guid,
        authorId: this.report.authorId,
        accessRoles: this.report.accessRoles,
        accessUsers: this.report.accessUsers
      })
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {       
        this.report.guid = data.guid;
        this.report.accessRoles = data.accessRoles;
        this.report.accessUsers = data.accessUsers;
      }
    });
  }
}
