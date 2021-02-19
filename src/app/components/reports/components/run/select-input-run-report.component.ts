import { DataSource } from 'src/app/components/data-source/shared/data-source.model';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { VariableService } from '../../shared/variable.service';
import { Report } from '../../shared/report.model';
import { MatDialog } from '@angular/material/dialog';
import { TableInputDialogComponent } from './table-input-dialog.component';

@Component({
  selector: 'select-input-run-report',
  template: `
    <mat-form-field style="width: 100%">
      <mat-label>{{variable.label}}</mat-label>
      <input type="text"
            matInput 
            [formControl]="autocompleteControl"
            [matAutocomplete]="auto">
      <button mat-icon-button matSuffix (click)="onMoreClick($event)">
        <mat-icon>more_horiz</mat-icon>
      </button>
      <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onOptionSelected($event.option.value)">
        <mat-option *ngFor="let option of (filteredOptions | async)?.data" [value]="option">
          {{option[variable.data.captionField]}}
        </mat-option>
      </mat-autocomplete>
    </mat-form-field>
  `
})
export class SelectInputRunReportComponent implements OnInit {
  @Input() report: Report;
  @Input() variable: any;
  @Input() multiple: boolean = false;
  
  autocompleteControl = new FormControl();
  filteredOptions: Observable<any>;

  dataSource: DataSource;
  context: any;

  constructor(private dialog: MatDialog,
              private variableService: VariableService) { }

  ngOnInit() {
    this.dataSource = this.report.dataSources.find(x => x.name === this.variable.data.dataSet.data.dataSourceName);
    this.context = { userId: 1 };

    this.filteredOptions = this.autocompleteControl.valueChanges
      .pipe(
        debounceTime(300),
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

  onOptionSelected(option) {
    if (option) {
      this.variable.value = option;
    } else {
      delete this.variable.value;
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
          multiple: this.multiple
        },
        autoFocus: false
      });
      
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (!this.multiple) {
          if (res.length > 0) {
            this.variable.value = res[0];
            this.autocompleteControl.setValue(res[0]);
          } else {
            this.variable.value = null;
            this.autocompleteControl.setValue(null);
          }
        }
      }
    });
  }
}