import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from "@angular/material/icon";
import { DetailReportComponent } from './detail/detail-report.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ReportsComponent } from './reports.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatChipsModule} from '@angular/material/chips';
import { NewReportComponent } from './new/new-report.component';
import { FormReportComponent } from './form/form-report.component';
import { DataSourceDialogReportComponent } from './data-source-dialog/data-source-dialog-report.component';
import { DataSetDialogReportComponent } from './data-set-dialog/data-set-dialog-report.component';
import { VariableDialogReportComponent } from './variable-dialog/variable-dialog-report.component';
import { VariableDialogTableSettingsReportComponent } from './variable-dialog/table-settings/variable-dialog-table-settings-report.component';
import { MalibuReportComponent } from './malibu/malibu-report.component';
import { RunDialogReportComponent } from './run-dialog/run-dialog-report.component';
import { InputFactoryReportComponent } from './input/factory/input-factory-report.component';
import { SelectInputReportComponent } from './input/select/select-input-report.component';
import { TableDialogInputReportComponent } from './input/table-dialog/table-dialog-input-report.component';
import { PerionInputReportComponent } from './input/period/period-input-report.component';
import { MultipleSelectInputReportComponent } from './input/multiple-select/multiple-select-input-report.component';
import { RunReportComponent } from './run/run-report.component';
import { DateInputReportComponent } from './input/date/date-input-report.component';
import { RunFormReportComponent } from './run-form/run-form-report.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    ReportsComponent,
    NewReportComponent,
    HeaderComponent,
    DetailReportComponent,
    FormReportComponent,
    DataSourceDialogReportComponent,
    DataSetDialogReportComponent,
    VariableDialogReportComponent,
    VariableDialogTableSettingsReportComponent,
    MalibuReportComponent,
    RunDialogReportComponent,
    InputFactoryReportComponent,
    SelectInputReportComponent,
    TableDialogInputReportComponent,
    PerionInputReportComponent,
    MultipleSelectInputReportComponent,
    RunReportComponent,
    DateInputReportComponent,
    RunFormReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ReportsComponent },
      { path: 'new', component: NewReportComponent },
      { path: ':id', component: DetailReportComponent },
      { path: 'run/:id', component: RunReportComponent }
    ]),
    
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatInputModule,
    MatSortModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatDividerModule,
    MatTreeModule,
    MatExpansionModule,
    MatListModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    
    FlexLayoutModule
  ]
})
export class ReportsModule { }