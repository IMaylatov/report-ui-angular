import { NotificationService } from 'src/app/shared/service/notification.service';
import { AfterViewInit, Component, ElementRef, Inject, Input, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Report } from "../../shared/report.model";
import { VariableService } from '../../shared/variable.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {fromEvent, merge, Observable, of as observableOf} from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { DataSource } from "../../shared/data-source.model";

@Component({
  selector: 'table-dialog-input-report',
  templateUrl: './table-dialog-input-report.component.html',
  styleUrls: ['./table-dialog-input-report.component.scss']
})
export class TableDialogInputReportComponent implements OnInit, AfterViewInit {
  report: Report;
  variable: any;
  context: any;
  multiple: boolean = false;

  dataSource: DataSource;

  displayedColumns: string[];
  filters: any[];
  
  data = [];

  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  
  isAllSelected: boolean = false;
  selection: SelectionModel<any>;
  
  constructor(public dialogRef: MatDialogRef<TableDialogInputReportComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private variableService: VariableService,
    private notificationService: NotificationService) { 
      this.report = dialogData.report;
      this.variable = dialogData.variable;
      this.context = dialogData.context;
      this.multiple = dialogData.multiple;
    }

  ngOnInit() {
    this.dataSource = this.report.dataSources.find(x => x.name === this.variable.data.dataSet.data.dataSourceName);

    this.displayedColumns = ['select', ...this.variable.data.table.columns.map(x => x.field)];
    this.filters = this.variable.data.table.columns.map(x => { return { id: x.field, value: ''}});
    
    let initialSelection = [];
    if (this.multiple) {
      if (this.variable.value) {
        if (this.variable.value.length === 1 &&
            this.variable.value[0][this.variable.data.captionField] === "Все") {
          this.isAllSelected = true;
        } else {
          initialSelection = this.variable.value
        }
      }
    } else {
      initialSelection = this.variable.value ? [this.variable.value] : [];
    }
    this.selection = new SelectionModel<any>(this.multiple, initialSelection);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
          debounceTime(150),
          distinctUntilChanged(),
          tap(() => {
              this.paginator.pageIndex = 0;
              this.paginator.page.emit();
          })
      )
      .subscribe();
      
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.data = [];
          this.isLoadingResults = true;
          const filters = this.filters.filter(x => x.value);
          const sortBy = this.sort.active ? `${this.sort.active} ${this.sort.direction}` : '';
          return this.variableService.getRecordDatas(this.dataSource, this.context, this.variable.data.dataSet, 
            this.paginator.pageSize, this.paginator.pageIndex, sortBy, filters);
        }),
        map((res: any) => {
          this.isLoadingResults = false;
          this.resultsLength = res.totalCount;

          return res.data;
        }),
        catchError((err) => {
          this.notificationService.showError(`Ошибка получения данных. ${err.error.message}`)
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => this.data = data);
  }

  onFilterClearClick(filter) {
    filter.value = '';
    this.paginator.pageIndex = 0;
    this.paginator.page.emit();
  }

  isAllPageSelected() {
    return  this.data.every(x => 
      this.selection.selected.some(d => x[this.variable.data.keyField] === d[this.variable.data.keyField]));
  }

  masterToggle() {
    this.isAllPageSelected() ?
      this.data.forEach(row => this.selection.deselect(row)) :
      this.data.forEach(row => this.selection.select(row));
  }

  onSelecteRowChange(row) {
    const indexSelectedRow = this.selection.selected
      .findIndex(x => x[this.variable.data.keyField] === row[this.variable.data.keyField]);
    if (indexSelectedRow !== -1) {
      this.selection.selected.splice(indexSelectedRow, 1);
    } else {
      if (!this.multiple) {
        this.selection.clear();
      }
      if (!this.isAllSelected) {
        this.selection.selected.push(row);
      }
    }
    this.isAllSelected = false;
  }

  onAllSelected() {
    this.isAllSelected = true;
    this.selection.clear();
  }

  isSelectedRow(row) {
    return this.selection.selected.some(x => x[this.variable.data.keyField] === row[this.variable.data.keyField]);
  }

  onSubmit(e) {
    if (this.isAllSelected) {
      const allValue = {};
      allValue[this.variable.data.captionField] = "Все";
      this.dialogRef.close([allValue]);
    } else {
      this.dialogRef.close(this.selection.selected);
    }
  }
}