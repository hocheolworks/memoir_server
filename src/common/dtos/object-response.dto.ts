export class ObjectResponse<T> {
  constructor(row: T, responseCode?: string, extras?: any) {
    this.row = row;
    this.responseCode = responseCode;
    this.extras = extras;
  }
  row: T;
  responseCode?: string;
  extras?: any;
}
