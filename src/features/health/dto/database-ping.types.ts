export type DatabasePingResult = {
  status: 'up' | 'down';
  initialized: boolean;
  latencyMs: number | null;
};

export interface DatabasePingPort {
  ping(): Promise<DatabasePingResult>;
}
