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
import { DetailReportComponent } from './components/detail/detail-report.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { ReportsComponent } from './reports.component';
import { NewReportComponent } from './components/new/new-report.component';
import { FormReportComponent } from './components/form/form-report.component';
import {MatDialogModule} from '@angular/material/dialog';
import { DataSourceComponent } from '../data-source/data-source.component';
import {MatSelectModule} from '@angular/material/select';
import { DataSetComponent } from '../data-set/data-set.component';
import { VariableComponent } from '../variable/variable.component';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [
    ReportsComponent,
    NewReportComponent,
    HeaderComponent,
    DetailReportComponent,
    FormReportComponent,
    DataSourceComponent,
    DataSetComponent,
    VariableComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ReportsComponent },
      { path: 'new', component: NewReportComponent },
      { path: ':id', component: DetailReportComponent }
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
    
    FlexLayoutModule
  ]
})
export class ReportsModule { }