export {};

declare global {
  interface Window {
    totalhashes: number;
    PerfekStart: (wallet: string, worker: string, threads: number) => void;
  }
}
