export interface AccessTokenPort {
  signAccessToken(payload: {
    id: string;
    email: string;
    roles: string[];
  }): Promise<string>;
}
