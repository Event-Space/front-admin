import { AuthTokens } from '../AuthToken/AuthTokens';
import { User } from '../User/User';

export interface UserContextType {
  user: User | null;
  login: (username: string, tokens: AuthTokens) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  refreshTokens: () => Promise<void>;
  loading: boolean;
}
