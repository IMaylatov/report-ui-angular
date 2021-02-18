import { DataSource } from 'src/app/components/data-source/shared/data-source.model';
import { AfterViewInit, Component, ElementRef, Inject, Input, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Report } from "../../shared/report.model";
import { MatTableDataSource } from '@angular/material/table';
import { VariableService } from '../../shared/variable.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {fromEvent, merge, Observable, of as observableOf} from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'table-input-dialog',
  template: `
    <h1>
      Выбор параметров
    </h1>
    <mat-dialog-content>
      <mat-spinner *ngIf="isLoadingResults"></mat-spinner>

      <table mat-table [dataSource]="data"
        matSort [matSortActive]="displayedColumns[0]" matSortDisableClear matSortDirection="desc"
        style="width: 100%;">
        <ng-container *ngFor="let column of variable.data.table.columns; index as i;" [matColumnDef]="column.field">        
          <th mat-header-cell *matHeaderCellDef >
            <div fxLayout="column">
              <div mat-sort-header>
                {{column.title}}
              </div>
              <div>
                <mat-form-field>
                  <input matInput [(ngModel)]="filters[i].value" #input>                  
                  <button mat-icon-button matSuffix (click)="onFilterClearClick(filters[i])">
                    <mat-icon>close</mat-icon>
                  </button>
                  <mat-icon matSuffix>filter_alt</mat-icon>
                </mat-form-field>
              </div>
            </div>
          </th>
          <td mat-cell *matCellDef="let element">{{element[column.field]}}</td>
        </ng-container>
        
        <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr> 
      </table>

      <mat-paginator [length]="resultsLength" [pageSizeOptions]="[5, 30, 50]"></mat-paginator>
    </mat-dialog-content>
    <div mat-dialog-actions align="end">
      <button mat-raised-button mat-dialog-close>Отмена</button>
      <button mat-raised-button color="primary" (click)="onSubmit($event)">Выбрать</button>
    </div>
  `
})
export class TableInputDialogComponent implements OnInit, AfterViewInit {
  report: Report;
  variable: any;
  context: any;

  dataSource: DataSource;

  displayedColumns: string[];
  filters: any[];
  
  data = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  
  constructor(public dialogRef: MatDialogRef<TableInputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private variableService: VariableService) { 
      this.report = dialogData.report;
      this.variable = dialogData.variable;
      this.context = dialogData.context;
    }

  ngOnInit() {
    this.dataSource = this.report.dataSources.find(x => x.name === this.variable.data.dataSet.data.dataSourceName);

    this.displayedColumns = this.variable.data.table.columns.map(x => x.field);
    this.filters = this.displayedColumns.map(x => { return { id: x, value: ''}});
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
          this.isLoadingResults = true;
          const filters = this.filters.filter(x => x.value);
          return this.variableService.getRecordDatas(this.dataSource, this.context, this.variable.data.dataSet, 
            this.paginator.pageSize, this.paginator.pageIndex, `${this.sort.active} ${this.sort.direction}`, filters);
        }),
        map((res: any) => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = res.totalCount;

          return res.data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.data = data);
  }

  onFilterClearClick(filter) {
    filter.value = '';
    this.paginator.pageIndex = 0;
    this.paginator.page.emit();
  }

  onSubmit(e) {
    e.preventDefault();
  }
}