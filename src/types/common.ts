// ----------------------------------------------------------------------

export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface GetParams {
  page?: number;
  size?: number;
  search?: string;
  sort?: string;
}

export interface GetRsponse<T> {
  content: T[];
  page: PageInfo;
}
