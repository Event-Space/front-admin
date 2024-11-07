import { AuthTokens } from '../AuthToken/AuthTokens';

export interface User {
  username: string;
  isAuthenticated: boolean;
  tokens: AuthTokens;
}
