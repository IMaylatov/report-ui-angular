export class Report {
  public id: number;
  public name: string;
  public type: string;

  public authorId: string;
  public dataSets: any[];
  public dataSources: any[];
  public variables: any[];

  public guid: string;
  public accessRoles: string[];
  public accessUsers: string[];
}