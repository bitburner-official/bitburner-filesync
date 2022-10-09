declare module "signal-js" {
  export type Signal = typeof signal;
  export default class signal {
    static on<T>(event: number, callback: (data: T) => void): void;
    static emit<T>(event: number, data: T): void;
    static trigger(event: number): void;
  }
}
