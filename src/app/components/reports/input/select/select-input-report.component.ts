import { Component, Input, OnInit } from "@angular/core";
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { VariableService } from '../../shared/variable.service';
import { Report } from '../../shared/report.model';
import { MatDialog } from '@angular/material/dialog';
import { DataSource } from "../../shared/data-source.model";
import { TableDialogInputReportComponent } from "../table-dialog/table-dialog-input-report.component";

@Component({
  selector: 'select-input-report',
  templateUrl: './select-input-report.component.html',
  styleUrls: ['./select-input-report.component.scss']
})
export class SelectInputReportComponent implements OnInit {
  @Input() report: Report;
  @Input() variable: any;
  @Input() context: any;
  
  autocompleteControl = new FormControl();
  filteredOptions: Observable<any>;

  dataSource: DataSource;

  constructor(private dialog: MatDialog,
              private variableService: VariableService) { }

  ngOnInit() {
    this.dataSource = this.report.dataSources.find(x => x.name === this.variable.data.dataSet.data.dataSourceName);
    
    this.filteredOptions = this.autocompleteControl.valueChanges
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

  onOptionSelected(option) {
    this.variable.value = option;
  }

  onMoreClick(e) {
    e.preventDefault();
    
    const dialogRef = this.dialog.open(TableDialogInputReportComponent, 
      { 
        width: '800px', 
        data: {  
          report: this.report,
          variable: this.variable,
          context: this.context
        },
        autoFocus: false
      });
      
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (res.length > 0) {
          this.variable.value = res[0];
          this.autocompleteControl.setValue(res[0]);
        } else {
          this.variable.value = null;
          this.autocompleteControl.setValue(null);
        }
      }
    });
  }
}