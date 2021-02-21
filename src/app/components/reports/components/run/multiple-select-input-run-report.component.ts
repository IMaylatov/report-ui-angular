import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { DataSource } from 'src/app/components/data-source/shared/data-source.model';
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { VariableService } from '../../shared/variable.service';
import { Report } from '../../shared/report.model';
import { MatDialog } from '@angular/material/dialog';
import { TableInputDialogComponent } from './table-input-dialog.component';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'multiple-select-input-run-report',
  template: `
    <mat-form-field style="width: 100%">
      <mat-label>{{variable.label}}</mat-label>
      <mat-chip-list #chipList>
        <mat-chip
          *ngFor="let item of variable.value"
          [selectable]="true"
          [removable]="true"
          (removed)="remove(item)">
          {{item[variable.data.captionField]}}
          <mat-icon matChipRemove>cancel</mat-icon>
        </mat-chip>
        <input
          #itemInput
          [formControl]="itemControl"
          [matAutocomplete]="auto"
          [matChipInputFor]="chipList"
          [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
          (matChipInputTokenEnd)="add($event)">
        <button *ngIf="variable.data.useTable" mat-icon-button matSuffix (click)="onMoreClick($event)">
          <mat-icon>more_horiz</mat-icon>
        </button>
        <button mat-icon-button matSuffix>
          <mat-icon>arrow_drop_down</mat-icon>
        </button>
      </mat-chip-list>
      <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn" 
        (optionSelected)="selected($event.option.value)">
        <mat-option *ngFor="let option of (filteredOptions | async)?.data" [value]="option">
          {{option[variable.data.captionField]}}
        </mat-option>
      </mat-autocomplete>
    </mat-form-field>
  `
})
export class MultipleSelectInputRunReportComponent implements OnInit {
  @Input() report: Report;
  @Input() variable: any;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  itemControl = new FormControl();
  filteredOptions: Observable<any>;

  @ViewChild('itemInput') itemInput: ElementRef<HTMLInputElement>;

  dataSource: DataSource;
  context: any;

  constructor(private dialog: MatDialog,
              private variableService: VariableService) { }

  ngOnInit() {
    this.dataSource = this.report.dataSources.find(x => x.name === this.variable.data.dataSet.data.dataSourceName);
    this.context = { userId: 1 };
    
    this.filteredOptions = this.itemControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(value => 
          this.variableService.getRecordDatas(
            this.dataSource, 
            this.context, 
            this.variable.data.dataSet, 
            10, 
            0, 
            [], 
            [ { id: this.variable.data.captionField, value } ]))
      );
  }

  displayFn = value => {
    if (value) { return value[this.variable.data.captionField]; }
  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.variable.value.push(value);
    }

    if (input) {
      input.value = '';
    }

    this.itemControl.setValue(null);
  }

  remove(item: any): void {
    const itemIndex = this.variable.value.findIndex(x => item[this.variable.data.keyField] === x[this.variable.data.keyField]);
    if (itemIndex >= 0) {
      this.variable.value.splice(itemIndex, 1);
    }
  }

  selected(item: any): void {
    const itemIndex = this.variable.value.findIndex(x => item[this.variable.data.keyField] === x[this.variable.data.keyField]);
    if (itemIndex === -1) {
      this.variable.value.push(item);
      this.itemInput.nativeElement.value = '';
      this.itemControl.setValue(null);
    }
  }

  onMoreClick(e) {
    e.preventDefault();
    
    const dialogRef = this.dialog.open(TableInputDialogComponent, 
      { 
        width: '800px', 
        data: {  
          report: this.report,
          variable: this.variable,
          context: this.context,
          multiple: true
        },
        autoFocus: false
      });
      
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.variable.value = res;
      }
    });
  }
}