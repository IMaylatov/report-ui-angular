import { Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { DataSourceComponent } from 'src/app/components/data-source/data-source.component';
import { Report } from '../../shared/report.model';
import { deepCopy } from '../../../../shared/utils/deep-copy';
import { DataSetComponent } from 'src/app/components/data-set/data-set.component';
import { DATASET_TYPE_SQLQUERY } from '../../shared/reportConst';
import { VariableComponent } from 'src/app/components/variable/variable.component';

@Component({
  selector: 'form-report',
  templateUrl: './form-report.component.html',
  styleUrls: ['./form-report.component.scss']
})
export class FormReportComponent {
  @Input() report: Report;

  @ViewChild('parameterMenuTrigger')
  contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  
  constructor(public dialog: MatDialog) { }

  onSave(): void {
    console.log(this.report);
  }

  onElementAddClick(elemType: string) {
    let modalComponent;
    let modalItem;
    switch (elemType) {
      case 'dataSources': 
        modalComponent = DataSourceComponent;
        modalItem = { id: 0, name: '', type: '', data: {}};
        break;
      case 'dataSets': 
        modalComponent = DataSetComponent;
        modalItem = { id: 0, name: '', type: DATASET_TYPE_SQLQUERY.name, data: {}};
        break;
      case 'variables': 
        modalComponent = VariableComponent;
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
        modalComponent = DataSourceComponent;
        break;
      case 'dataSets':
        modalComponent = DataSetComponent;
        break;
      case 'variables':
        modalComponent = VariableComponent;
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
}
