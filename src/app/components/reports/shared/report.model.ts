import { DataSet } from './data-set.model';
import { DataSource } from './data-source.model';
import { Variable } from './variable.model';

export class Report {
  public id: number;
  public name: string;

  public authorId: string;
  public dataSets: DataSet[];
  public dataSources: DataSource[];
  public variables: Variable[];

  public guid: string;
  public accessRoles: string[];
  public accessUsers: string[];
}