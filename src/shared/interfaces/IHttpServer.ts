export interface HttpServer {
  start(port: number | string): void | Promise<void>;
}
