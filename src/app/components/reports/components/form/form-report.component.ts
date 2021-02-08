import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { DataSourceComponent } from 'src/app/components/data-source/data-source.component';
import { DataSource } from 'src/app/components/data-source/shared/data-source.model';
import { Report } from '../../shared/report.model';
import { deepCopy } from '../../../../shared/utils/deep-copy';
import { DataSetComponent } from 'src/app/components/data-set/data-set.component';
import { DATASET_TYPE_SQLQUERY } from '../../shared/reportConst';

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
    const dialogRef = this.dialog.open(DataSourceComponent, 
      { width: '800px', data: deepCopy({ id: 0, name: '', type: '', data: {}}) });

    dialogRef.afterClosed().subscribe(dataSource => {
      if (dataSource) {
        this.report.dataSources.push(dataSource);
      }
    });
  }

  onDataSetAddClick() {
    const dialogRef = this.dialog.open(DataSetComponent, {
      width: '800px', data: { 
        report: this.report, 
        dataSet:  deepCopy({ id: 0, name: '', type: DATASET_TYPE_SQLQUERY.name, data: {}})
      }
    });

    dialogRef.afterClosed().subscribe(dataSet => {
      if (dataSet) {
        this.report.dataSets.push(dataSet);
      }
    });
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
        {
          const dialogRef = this.dialog.open(DataSourceComponent, 
            { width: '800px', data: deepCopy(data.item) });
          dialogRef.afterClosed().subscribe(dataSource => {
            if (dataSource) {
              const dataSourceIndex = this.report.dataSources.indexOf(data.item);
              this.report.dataSources[dataSourceIndex] = dataSource;
            }
          });
        }
        break;
      case 'dataSet':
        {
          const dialogRef = this.dialog.open(DataSetComponent, 
            { width: '800px', data: { report: this.report, dataSet: deepCopy(data.item)} });
          dialogRef.afterClosed().subscribe(dataSet => {
            if (dataSet) {
              const dataSetIndex = this.report.dataSets.indexOf(data.item);
              this.report.dataSets[dataSetIndex] = dataSet;
            }
          });
        }
        break;
    }
  }

  onElemDeleteClick(data: any) {
    switch(data.elemType) {
      case 'dataSource':
        const dataSourceIndex = this.report.dataSources.indexOf(data.item);
        this.report.dataSources.splice(dataSourceIndex, 1);
        break;
      case 'dataSource':
        const dataSetIndex = this.report.dataSets.indexOf(data.item);
        this.report.dataSets.splice(dataSetIndex, 1);
        break;
    }
  }
}
