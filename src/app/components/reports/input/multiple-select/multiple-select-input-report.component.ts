import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { VariableService } from '../../shared/variable.service';
import { Report } from '../../shared/report.model';
import { MatDialog } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { DataSource } from '../../shared/data-source.model';
import { TableDialogInputReportComponent } from '../table-dialog/table-dialog-input-report.component';

@Component({
  selector: 'multiple-select-input-report',
  templateUrl: './multiple-select-input-report.component.html',
  styleUrls: ['./multiple-select-input-report.component.scss']
})
export class MultipleSelectInputReportComponent implements OnInit {
  @Input() report: Report;
  @Input() variable: any;
  @Input() context: any;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  itemControl = new FormControl();
  filteredOptions: Observable<any>;

  @ViewChild('itemInput') itemInput: ElementRef<HTMLInputElement>;

  dataSource: DataSource;

  constructor(private dialog: MatDialog,
              private variableService: VariableService) { }

  ngOnInit() {
    this.dataSource = this.report.dataSources.find(x => x.name === this.variable.data.dataSet.data.dataSourceName);
    
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
    
    const dialogRef = this.dialog.open(TableDialogInputReportComponent, 
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