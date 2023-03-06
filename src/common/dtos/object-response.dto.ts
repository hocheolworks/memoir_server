export class ObjectResponse<T> {
  constructor(row: T, responseCode?: string, extras?: any) {
    this.row = row;
  }
  row: T;
}
