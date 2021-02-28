import { saveAs } from 'file-saver';
import { Component, Input, OnInit } from '@angular/core';
import { Report } from '../shared/report.model';
import { Template } from '../shared/template.model';

@Component({
  selector: 'docx-report',
  templateUrl: './docx-report.component.html',
  styleUrls: ['./docx-report.component.scss']
})
export class DocxReportComponent implements OnInit {
  @Input() report: Report;
  @Input() template: Template;
  
  constructor() { }

  ngOnInit(): void { }

  download() {
    saveAs(this.template, `${this.report.name}.docx`);
  }

  onTemplateChange(files: FileList) {
    if (files.length > 0) {
      const file = files.item(0);
      this.template.data = file;
    } else {
      this.onDeleteTemplateClick();
    }
  }

  onDeleteTemplateClick() {
    this.template.data = null;
  }
}
