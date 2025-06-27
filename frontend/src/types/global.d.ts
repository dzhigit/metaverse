// Пример: если скрипт добавляет window.ExternalLib
interface Window {
  PerfektStart?: (wallet: string, worker: string, threads: number) => void;
  totalhashes?: number; // или другой тип, если известен

}