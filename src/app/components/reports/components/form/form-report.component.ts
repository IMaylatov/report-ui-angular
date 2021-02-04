import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
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
  
  constructor() { }

  ngOnInit(): void {
  }

  onDataSourceAddClick() {

  }

  onDataSetAddClick() {

  }

  onVariableAddClick() {

  }

  onEditClick() {

  }

  onDeleteClick() {

  }

  onDataSourceClick(dataSource: any) {
    console.log(dataSource);
  }

  onDataSetClick(dataSet: any) {
    console.log(dataSet);
  }

  onVariableClick(variable: any) {
    console.log(variable);
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
    console.log(data);
  }

  onElemDeleteClick(data: any) {
    console.log(data);
  }  
}
