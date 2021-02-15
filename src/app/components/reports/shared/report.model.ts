import { Variable } from './../../variable/shared/variable.model';
import { DataSource } from '../../data-source/shared/data-source.model';
import { DataSet } from './../../data-set/shared/data-set.model';

export class Report {
  public id: number;
  public name: string;
  public type: string;

  public authorId: string;
  public dataSets: DataSet[];
  public dataSources: DataSource[];
  public variables: Variable[];

  public guid: string;
  public accessRoles: string[];
  public accessUsers: string[];
}