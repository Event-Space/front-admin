import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../../entities/User/User';
import { UserContextType } from '../../entities/UserContextType/UserContextType';
import { AuthTokens } from '../../entities/AuthToken/AuthTokens';

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const username = localStorage.getItem('username');

    if (accessToken && refreshToken && username) {
      setUser({
        username,
        isAuthenticated: true,
        tokens: { accessToken, refreshToken },
      });
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshTokens();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const login = (username: string, tokens: AuthTokens) => {
    setUser({
      username,
      isAuthenticated: true,
      tokens,
    });
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('username', username);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
  };

  const refreshTokens = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(
        'https://space-event.kenuki.org/security-service/api/auth/refresh',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        },
      );

      if (!response.ok) {
        logout();
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await response.json();

      setUser(prevUser =>
        prevUser
          ? {
              ...prevUser,
              tokens: { accessToken, refreshToken: newRefreshToken },
            }
          : null,
      );

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
    } catch (error) {
      console.error('Failed to refresh tokens', error);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, login, logout, refreshTokens, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};
