export interface HttpRequest {
  body: any;
  headers?: any;
  params?: any;
  query?: any;
  [key: string]: any;
}

export interface HttpResponse {
  statusCode: number;
  body?: any;
}
