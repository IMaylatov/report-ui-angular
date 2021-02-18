import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class VariableService {
  constructor(private http: HttpClient) { }
  
  getRecordDatas(dataSource, context, dataSet, pageSize, pageIndex, sortBy, filters) {
    const formData = new FormData();
    
    formData.append('dataSource', JSON.stringify(dataSource));
    formData.append('context', JSON.stringify(context));
    formData.append('dataSet', JSON.stringify(dataSet));
    formData.append('pageSize', pageSize);
    formData.append('pageIndex', pageIndex);
    formData.append('sortBy', sortBy);
    formData.append('filters', JSON.stringify(filters));
    
    return this.http.post(`/api/dataSet/data`, formData);
  }
}