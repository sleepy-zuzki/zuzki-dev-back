export interface HashingPort {
  hash(plain: string): Promise<string>;
}
