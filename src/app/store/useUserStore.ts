import { useContext } from 'react';
import { UserContext } from '../provider/UserProvider';
import { UserContextType } from '../../entities/UserContextType/UserContextType';

export const useUserStore = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserStore must be used within a UserProvider');
  }
  return context;
};
