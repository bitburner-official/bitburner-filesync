import type { Stats } from "fs";

export interface Message {
  jsonrpc: "2.0";
  method?: string;
  result?: ResultType;
  params?: FileMetadata;
  error?: string;
  id?: number;
}

type ResultType = string | number | string[] | FileContent[];
type FileMetadata = FileData | FileContent | FileLocation | FileServer;

export interface FileData {
  filename: string;
  content: string;
  server: string;
}

export interface FileContent {
  filename: string;
  content: string;
}

export interface FileLocation {
  filename: string;
  server: string;
}

export interface FileServer {
  server: string;
}

export interface FileEvent {
  path: string;
}

export interface File extends FileEvent {
  stats: Stats;
}
