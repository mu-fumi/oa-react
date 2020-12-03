export interface RequestRes<T> {
  code: number;
  result: T;
  msg: string;
}

export interface PageRequestRes<T>
  extends RequestRes<{
    data: T[];
    pageNo: number;
    pageSize: number;
    totalCount: number;
    totalPage: number;
  }> {}
