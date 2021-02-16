import { DataSource } from 'src/app/components/data-source/shared/data-source.model';
import { Variable } from '../../../variable/shared/variable.model';
import { Component, Input, OnInit } from "@angular/core";
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { VariableService } from '../../shared/variable.service';
import { Report } from '../../shared/report.model';

@Component({
  selector: 'select-input-run-report',
  template: `
    <mat-form-field>
      <mat-label>{{variable.label}}</mat-label>
      <input type="text"
            aria-label="variable.label"
            matInput
            [formControl]="autocompleteControl"
            [matAutocomplete]="auto">
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
  
  autocompleteControl = new FormControl();
  filteredOptions: Observable<any>;

  dataSource: DataSource;
  context: any;

  constructor(private variableService: VariableService) { }

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
}