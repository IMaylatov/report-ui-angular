import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CONNECTION_TYPE_CONNECTION_STRING, CONNECTION_TYPES } from '../../reports/shared/reportConst';

@Component({
  selector: 'data-source-connection-type',
  templateUrl: 'data-source-connection-type.component.html',
  providers: [{ 
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DataSourceConnectionTypeComponent),
    multi: true
   }
  ]
})
export class DataSourceConnectionTypeComponent implements ControlValueAccessor {
  @Input() connectionTypeForm: FormGroup;

  connectionTypes: any[] = CONNECTION_TYPES;
  connectionTypeConnectionString: string = CONNECTION_TYPE_CONNECTION_STRING.name;

  @Input()
  value: any;
  
  onChange(_: any) {}
  touched = () => {};
  validatorChange = () => {};

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn): void {
    this.touched = fn;
  }
  
  onConnectionTypeChange() {
    switch(this.value.connectionType) {
      case CONNECTION_TYPE_CONNECTION_STRING.name:
        this.value.connectionString = '';
        break;
      default:
        this.value = {connectionType: this.value.connectionType};
        break;
    }
  }
}