import type { Stats } from "fs";

export interface Message {
  id: string;
  method?: string;
  jsonrpc: string;
  params?: object;
}

export interface FileEvent {
  path: string;
}

export interface File extends FileEvent {
  stats: Stats;
}
