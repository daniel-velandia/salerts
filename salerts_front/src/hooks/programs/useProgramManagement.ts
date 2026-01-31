import { useState, useEffect, useMemo } from 'react';
import { useApi } from '@/hooks/common/useApi';
import { useAppDispatch } from '@/infraestructure/store/hooks';
import { setLoading, setError } from '@/infraestructure/store/uiSlice';
import type { Program } from '@/domain/models/program/Program';
import { emptyCreateProgramPayload, type CreateProgramPayload } from "@/domain/models/program/CreateProgramPayload";
import type { UpdateProgramParams } from "@/domain/models/program/UpdateProgramParams";
import { getAllPrograms, createProgram, updateProgram } from '@/infraestructure/services/programApi';
import { getAllStaff } from '@/infraestructure/services/staffApi';
import type { StaffResponse } from '@/domain/models/staff/StaffResponse';
import type { Option } from '@/domain/models/Option';

export interface Result {
  filteredPrograms: Program[];
  searchTerm: string;
  coordinatorOptions: Option[];
  isDialogOpen: boolean;
  defaultValues: CreateProgramPayload;
  setSearchTerm: (term: string) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
  openDialog: (program: Program | null) => void;
  handleSaveProgram: (data: CreateProgramPayload) => void;
}

export function useProgramManagement(): Result {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [defaultValues, setDefaultValues] = useState<CreateProgramPayload>(emptyCreateProgramPayload);

  const {
    data: programs,
    loading: loadingPrograms,
    error: errorPrograms,
    call: fetchPrograms,
  } = useApi<Program[], void>(getAllPrograms);

  const {
    data: staffList,
    loading: loadingStaff,
    error: errorStaff,
    call: fetchStaff,
  } = useApi<StaffResponse[], { role?: string }>(getAllStaff);

  const {
    data: createdProgram,
    call: create,
    loading: creating,
    error: errorCreate,
  } = useApi<void, CreateProgramPayload>(createProgram);

  const {
    data: updatedProgram,
    call: update,
    loading: updating,
    error: errorUpdate,
  } = useApi<void, UpdateProgramParams>(updateProgram);

  useEffect(() => {
    fetchPrograms();
    fetchStaff({ role: 'COORDINATOR' });
  }, [fetchPrograms, fetchStaff]);

  useEffect(() => {
    fetchPrograms();
  }, [createdProgram, updatedProgram])

  useEffect(() => {
    const isLoading = loadingPrograms || loadingStaff || creating || updating;
    const errors = errorPrograms || errorStaff || errorCreate || errorUpdate;

    dispatch(setLoading(isLoading));
    if (errors && errors.status !== 499) {
      dispatch(setError(errors, errorPrograms !== null || errorStaff !== null));
    }
  }, [
    loadingPrograms,
    loadingStaff,
    creating,
    updating,
    errorPrograms,
    errorStaff,
    errorCreate,
    errorUpdate,
    dispatch
  ]);

  const openDialog = (program: Program | null) => {
    setDefaultValues({
        programName: program?.name || '',
        coordinatorId: program?.coordinatorId || '' 
    });
    setSelectedProgramId(program?.id || null);
    setIsDialogOpen(true);
  };

  const handleSaveProgram = (data: CreateProgramPayload) => {
    setIsDialogOpen(false);

    if (selectedProgramId)
     update({ id: selectedProgramId, data });
    else
     create(data);
  };

  const coordinatorOptions: Option[] = useMemo(() => {
    return (staffList || []).map(staff => ({
      label: `${staff.name} ${staff.lastname}`,
      id: staff.id
    }));
  }, [staffList]);

  const filteredPrograms: Program[] = useMemo(() => {
    return (programs || []).filter(program =>
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (program.code && program.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [programs, searchTerm]);

  return {
    filteredPrograms,
    searchTerm,
    coordinatorOptions,
    isDialogOpen,
    defaultValues,
    setSearchTerm,
    setIsDialogOpen,
    openDialog,
    handleSaveProgram,
  };
}
