import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { DataSourceComponent } from 'src/app/components/data-source/data-source.component';
import { DataSource } from 'src/app/components/data-source/shared/data-source.model';
import { Report } from '../../shared/report.model';

@Component({
  selector: 'form-report',
  templateUrl: './form-report.component.html',
  styleUrls: ['./form-report.component.scss']
})
export class FormReportComponent implements OnInit {
  @Input() report: Report;

  @ViewChild('parameterMenuTrigger')
  contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onSave(): void {
    console.log(this.report);
  }

  onDataSourceAddClick() {    
    const dialogRef = this.getDataSourceDialog({ id: 0, name: '', type: '', data: {}});

    dialogRef.afterClosed().subscribe(dataSource => {
      if (dataSource) {
        this.report.dataSources.push(dataSource);
      }
    });
  }

  onDataSetAddClick() {

  }

  onVariableAddClick() {

  }

  onContextMenu(event: MouseEvent, data: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { data };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  onElemEditClick(data: any) {
    switch(data.elemType) {
      case 'dataSource':
        const dialogRef = this.getDataSourceDialog(data.item);
        dialogRef.afterClosed().subscribe(dataSource => {
          if (dataSource) {
            const dataSourceIndex = this.report.dataSources.indexOf(data.item);
            this.report.dataSources[dataSourceIndex] = dataSource;
          }
        });
        break;
    }
  }

  onElemDeleteClick(data: any) {
    switch(data.elemType) {
      case 'dataSource':
        const dataSourceIndex = this.report.dataSources.indexOf(data.item);
        this.report.dataSources.splice(dataSourceIndex, 1);
        break;
    }
  }  

  getDataSourceDialog(dataSource) {
    return this.dialog.open(DataSourceComponent, {
      width: '800px',
      data: dataSource
    });
  }
}
