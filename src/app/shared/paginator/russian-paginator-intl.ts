import { MatPaginatorIntl } from "@angular/material/paginator";

const russianRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 из ${length}`; }
  
  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} из ${length}`;
}


export function getRussianPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  
  paginatorIntl.itemsPerPageLabel = 'Записей на странице:';
  paginatorIntl.nextPageLabel = 'Следующая страница';
  paginatorIntl.firstPageLabel = 'Первая страница';
  paginatorIntl.previousPageLabel = 'Предыдущая страница';
  paginatorIntl.lastPageLabel = 'Последняя страница';
  paginatorIntl.getRangeLabel = russianRangeLabel;
  
  return paginatorIntl;
}