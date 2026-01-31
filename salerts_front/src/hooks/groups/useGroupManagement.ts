import { useState, useEffect, useMemo } from 'react';
import { useApi } from '@/hooks/common/useApi';
import { useAppDispatch } from '@/infraestructure/store/hooks';
import { setLoading, setError } from '@/infraestructure/store/uiSlice';
import type { Group } from '@/domain/models/Group';
import { getAllGroups, type GetGroupsParams } from '@/infraestructure/services/groupApi';
import { getGlobalOptions } from '@/infraestructure/services/optionsApi';
import type { GroupFilterParams } from '@/domain/models/groups/GroupFilterParams';
import type { GlobalOptions } from '@/domain/models/options/GlobalOptions';
import type { Option } from '@/domain/models/Option';

export function useGroupManagement() {
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<GroupFilterParams>({
    search: '',
    periodId: '',
    subjectId: '',
    teacherId: ''
  });

  // Fetch groups with filters
  const {
    data: groups,
    loading: loadingGroups,
    error: errorGroups,
    call: fetchGroups
  } = useApi<Group[], GetGroupsParams>(getAllGroups);

  const {
    data: options,
    loading: loadingOptions,
    error: errorOptions,
  } = useApi<GlobalOptions, void>(getGlobalOptions, {
    autoFetch: true,
    params: undefined,
  });

  // Fetch groups whenever filters change - only if at least one filter is applied
  useEffect(() => {
    const hasFilters = Object.values(filters).some(v => v !== undefined && v !== "" && v !== "ALL");
    
    if (hasFilters) {
      const params: GetGroupsParams = {};
      if (filters.periodId && filters.periodId !== 'ALL') params.periodId = filters.periodId;
      if (filters.subjectId && filters.subjectId !== 'ALL') params.subjectId = filters.subjectId;
      if (filters.teacherId && filters.teacherId !== 'ALL') params.teacherId = filters.teacherId;
      
      fetchGroups(params);
    }
  }, [filters.periodId, filters.subjectId, filters.teacherId, fetchGroups]);

  // Sync Global State
  useEffect(() => {
    const isLoading = loadingGroups || loadingOptions;
    const error = errorGroups || errorOptions;

    dispatch(setLoading(isLoading));
    
    if (error && error.status !== 499) {
      dispatch(setError(error, true));
    }
  }, [loadingGroups, loadingOptions, errorGroups, errorOptions, dispatch]);

  const applyFilters = (newFilters: GroupFilterParams) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Client-side search filtering
  const filteredGroups = useMemo(() => {
    const search = filters.search || '';
    return (groups || []).filter(group => {
      if (!search) return true;
      const matchesSearch = 
        group.groupName.toLowerCase().includes(search.toLowerCase()) ||
        group.subjectName.toLowerCase().includes(search.toLowerCase()) ||
        group.teacherName.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [groups, filters.search]);

  // Statistics
  const statistics = useMemo(() => {
    const allGroups = groups || [];
    return {
      totalGroups: allGroups.length,
      uniqueSubjects: new Set(allGroups.map(g => g.subjectName)).size,
      uniqueTeachers: new Set(allGroups.map(g => g.teacherName)).size,
      totalSchedules: allGroups.reduce((acc, g) => acc + g.schedules.length, 0)
    };
  }, [groups]);

  const periodOptions: Option[] = useMemo(() => 
    (options?.periods || []).map((p) => ({ id: p.id, label: p.name }))
  , [options]);

  const subjectOptions: Option[] = useMemo(() => 
    (options?.subjects || []).map((s) => ({ id: s.id, label: s.name }))
  , [options]);

  const teacherOptions: Option[] = useMemo(() => 
    (options?.teachers || []).map((t) => ({ id: t.id, label: t.name }))
  , [options]);

  return {
    groups: groups || [],
    filteredGroups,
    loading: loadingGroups,
    filters,
    applyFilters,
    statistics,
    periodOptions,
    subjectOptions,
    teacherOptions,
    refresh: () => {
      const params: GetGroupsParams = {};
      if (filters.periodId && filters.periodId !== 'ALL') params.periodId = filters.periodId;
      if (filters.subjectId && filters.subjectId !== 'ALL') params.subjectId = filters.subjectId;
      if (filters.teacherId && filters.teacherId !== 'ALL') params.teacherId = filters.teacherId;
      fetchGroups(params);
    }
  };
}
