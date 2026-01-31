import { useEffect } from 'react';
import { useApi } from '@/hooks/common/useApi';
import { useAppDispatch } from '@/infraestructure/store/hooks';
import { setLoading, setError } from '@/infraestructure/store/uiSlice';
import type { Period } from '@/domain/models/Period';
import { 
  getAllPeriods, 
  createPeriod, 
  activatePeriod,
  type CreatePeriodPayload 
} from '@/infraestructure/services/periodApi';

export function usePeriodManagement() {
  const dispatch = useAppDispatch();

  // Fetch all periods
  const {
    data: periods,
    loading: loadingPeriods,
    error: errorPeriods,
    call: fetchPeriods
  } = useApi<Period[], void>(getAllPeriods, {
    autoFetch: true,
    params: undefined
  });

  // Create period operation
  const { 
    call: create, 
    loading: creating, 
    error: errorCreate 
  } = useApi<Period, CreatePeriodPayload>(createPeriod);

  // Activate period operation
  const { 
    call: activate, 
    loading: activating, 
    error: errorActivate 
  } = useApi<Period, string>(activatePeriod);

  // Sync Global State for all loading and error states
  useEffect(() => {
    const isLoading = loadingPeriods || creating || activating;
    dispatch(setLoading(isLoading));
    
    // Dispatch errors conditionally (skip 999 status)
    const errors = [errorPeriods, errorCreate, errorActivate].filter(e => e && e.status !== 499);
    if (errors.length > 0) {
      dispatch(setError(errors[0]));
    }
  }, [loadingPeriods, creating, activating, errorPeriods, errorCreate, errorActivate, dispatch]);

  return {
    periods: periods || [],
    loading: loadingPeriods || creating || activating,
    createPeriod: (data: CreatePeriodPayload) => {
      create(data);
      setTimeout(() => fetchPeriods(), 500);
    },
    activatePeriod: (id: string) => {
      activate(id);
      setTimeout(() => fetchPeriods(), 500);
    },
    refresh: fetchPeriods
  };
}
