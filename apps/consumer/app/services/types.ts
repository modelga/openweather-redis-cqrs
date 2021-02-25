export interface ListeningInterface {
  listen(): Promise<string> | Promise<string>[];
}
