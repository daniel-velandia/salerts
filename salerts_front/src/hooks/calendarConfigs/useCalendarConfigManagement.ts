import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/common/useApi';
import { useAppDispatch } from '@/infraestructure/store/hooks';
import { setLoading, setError } from '@/infraestructure/store/uiSlice';
import type { CalendarConfig } from '@/domain/models/CalendarConfig';
import { 
  getConfigsByPeriod,
  createCalendarConfigs,
  updateCalendarConfig,
  type CreateCalendarConfigsPayload,
  type UpdateCalendarConfigPayload
} from '@/infraestructure/services/calendarConfigApi';

export function useCalendarConfigManagement() {
  const dispatch = useAppDispatch();
  const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);

  // Fetch configs by period (lazy loading)
  const {
    data: configs,
    loading: loadingConfigs,
    error: errorConfigs,
    call: fetchConfigsForPeriod
  } = useApi<CalendarConfig[], string>(getConfigsByPeriod);

  // Create configs operation
  const { 
    call: create, 
    loading: creating, 
    error: errorCreate 
  } = useApi<CalendarConfig[], CreateCalendarConfigsPayload>(createCalendarConfigs);

  // Update config operation
  const { 
    call: update, 
    loading: updating, 
    error: errorUpdate 
  } = useApi<CalendarConfig, { id: string; data: UpdateCalendarConfigPayload }>(
    ({ id, data }) => updateCalendarConfig(id, data)
  );

  // Fetch configs when selected period changes
  useEffect(() => {
    if (selectedPeriodId) {
      fetchConfigsForPeriod(selectedPeriodId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriodId]);

  // Sync Global State for all loading and error states
  useEffect(() => {
    const isLoading = loadingConfigs || creating || updating;
    dispatch(setLoading(isLoading));
    
    // Dispatch errors conditionally (skip 999 status)
    const errors = [errorConfigs, errorCreate, errorUpdate].filter(e => e && e.status !== 499);
    if (errors.length > 0) {
      dispatch(setError(errors[0]));
    }
  }, [loadingConfigs, creating, updating, errorConfigs, errorCreate, errorUpdate, dispatch]);

  return {
    configs: configs || [],
    loading: loadingConfigs || creating || updating,
    selectedPeriodId,
    selectPeriod: (periodId: string) => {
      setSelectedPeriodId(periodId);
    },
    createConfigs: (data: CreateCalendarConfigsPayload) => {
      create(data);
      setTimeout(() => {
        if (selectedPeriodId) fetchConfigsForPeriod(selectedPeriodId);
      }, 500);
    },
    updateConfig: (id: string, data: UpdateCalendarConfigPayload) => {
      update({ id, data });
      setTimeout(() => {
        if (selectedPeriodId) fetchConfigsForPeriod(selectedPeriodId);
      }, 500);
    },
    refresh: () => {
      if (selectedPeriodId) fetchConfigsForPeriod(selectedPeriodId);
    }
  };
}
