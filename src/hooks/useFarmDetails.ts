import { useContext } from 'react';
import { FarmContext } from '../context/FarmContext';

export function useFarmDetails() {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarmDetails must be used within a FarmProvider');
  }
  return context;
}
