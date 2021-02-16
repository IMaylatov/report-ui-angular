import { Component, Input, OnInit } from '@angular/core';
import { Report } from '../../shared/report.model';
import { saveAs } from "file-saver";
import { DATASET_TYPE_SQLQUERY, VARIABLE_TYPE_DATE, VARIABLE_TYPE_MULTIPLE_SELECT, VARIABLE_TYPE_PERIOD, VARIABLE_TYPE_SELECT } from '../../shared/reportConst';
import { encode, decode } from 'iconv-lite';

@Component({
  selector: 'malibu-report',
  templateUrl: './malibu-report.component.html',
  styleUrls: ['./malibu-report.component.scss']
})
export class MalibuReportComponent implements OnInit {
  @Input() report: Report;
  @Input() template: { id: number, data: any};

  variableTypeNone = 'none';
  variableTypeSelect = VARIABLE_TYPE_SELECT.name;
  variableTypeMultipliSelect = VARIABLE_TYPE_MULTIPLE_SELECT.name;

  reportType: any;

  ngOnInit(): void {    
    const documentVariable = this.report.variables.find(x => x.name === 'Document');
    if (documentVariable) {
      this.reportType = documentVariable.type;
    } else {
      this.reportType = 'none';
    }    
  }

  onTemplateChange(files: FileList) {
    if (files.length > 0) {
      const file = files.item(0);
      this.template.data = file;
      this.parseTemplate();
      this.reportType = this.variableTypeNone;
    } else {
      this.onDeleteTemplateClick();
    }
  }

  onDeleteTemplateClick() {
    this.template.data = null;
    this.deleteDocumentVariable();
  }

  download() {
    saveAs(this.template, `${this.report.name}.mlbrpt`);
  }

  parseTemplate() {
    let reader = new FileReader();

    reader.onload = (e) => {
      const xml = e.target.result;
      const dataSourceName = this.report.dataSources[0].name;

      const parser = new DOMParser();
      const templateXml = parser.parseFromString(xml as string, "text/xml");
      const reportDescBase64 = templateXml.getElementsByTagName("ReportDesc")[0].childNodes[0].nodeValue;    
      const reportDesc = decode(encode(reportDescBase64, 'base64'), 'win1251');

      const reportDescXml = parser.parseFromString(reportDesc, "text/xml");

      let xmlDataSets = Array.prototype.slice.call(reportDescXml.getElementsByTagName("DATASET"));
      this.report.dataSets = xmlDataSets.map(x => {
        return {
          name: x.getAttribute('NAME'),
          type: DATASET_TYPE_SQLQUERY.name,
          data: {
            dataSourceName: dataSourceName,
            query: x.getElementsByTagName("SQL")[0].childNodes[0].nodeValue
          }
        }
      });
      
      let xmlVariables = Array.prototype.slice.call(reportDescXml.getElementsByTagName("PARAM"));
      this.report.variables = xmlVariables.map(x => {
        let name = x.getAttribute('NAME');
        let label = '';
        if (x.getElementsByTagName("QUERY_STRING")[0].childNodes[0]) {
          label = x.getElementsByTagName("QUERY_STRING")[0].childNodes[0].nodeValue;
        }
        let type = x.getElementsByTagName("PARAM_TYPE")[0].childNodes[0].nodeValue;
        let required = x.getElementsByTagName("REQUIRED")[0].childNodes[0].nodeValue === 'True';
        
        switch(type) {
          case '0':
            return { name, label, required, type: VARIABLE_TYPE_SELECT.name, 
              data: { 
                captionField: '', 
                dataSet: { type: 'sqlQuery', data: { dataSourceName: dataSourceName, query: '' } }
              }  };
          case '1':
            return { name, label, required, type: VARIABLE_TYPE_MULTIPLE_SELECT.name, 
              data: { 
                captionField: '', keyField: '', 
                dataSet: { type: 'sqlQuery', data: { dataSourceName: dataSourceName, query: '' } }
              } };
          case '3':
            return { name, label, required, type: VARIABLE_TYPE_DATE.name };
          case '4':
            return { name, label, required, type: VARIABLE_TYPE_PERIOD.name };
          default:
            return { name, label, required };
        }
      });
    };

    reader.readAsText(this.template.data);
  }

  onReportTypeChange(reportType) {
    this.deleteDocumentVariable();

    if (reportType !== 'none') {
      let variable = {
        id: 0,
        name: 'Document',
        label: reportType === VARIABLE_TYPE_SELECT.name ? 'Документ' : 'Документы',
        required: true,
        type: reportType,
        data: {
          captionField: '',
          keyField: '',
          dataSet: {
            type: 'sqlQuery',
            data: {
              dataSourceName: this.report.dataSources[0].name,
              query: ''
            }
          }
        }
      }
      this.report.variables.push(variable);
    }
  }

  deleteDocumentVariable() {
    const documentVariableIndex = this.report.variables.findIndex(x => x.name === 'Document');
    if (documentVariableIndex !== -1) {
      this.report.variables.splice(documentVariableIndex, 1);
    }
  }
}