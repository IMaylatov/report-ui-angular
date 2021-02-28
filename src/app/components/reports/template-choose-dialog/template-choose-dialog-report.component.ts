import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'template-choose-dialog-report',
  templateUrl: './template-choose-dialog-report.component.html',
  styleUrls: ['./template-choose-dialog-report.component.scss']
})
export class TemplateChooseDialogReportComponent {
  constructor(public dialogRef: MatDialogRef<TemplateChooseDialogReportComponent>) { }

  onChoose(type) {
    this.dialogRef.close(type);
  }
}
