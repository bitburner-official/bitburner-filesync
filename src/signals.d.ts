declare module "signal-js" {
  export type Signal = typeof signal;
  export default class signal {
    static on<T>(event: string, callback: (data: T) => void): void;
    static emit<T>(event: string, data: T): void;
    static trigger(event: string): void;
  }
}
