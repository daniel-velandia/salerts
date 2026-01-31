import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/shadcn/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/components/shadcn/tabs';
import { Button } from '@/ui/components/shadcn/button';
import { Input } from '@/ui/components/shadcn/input';
import { Label } from '@/ui/components/shadcn/label';
import { Badge } from '@/ui/components/shadcn/badge';
import { Calendar, Plus, Edit2, CheckCircle, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/ui/components/shadcn/dialog';
import { usePeriodManagement } from '@/hooks/periods/usePeriodManagement';
import { useCalendarConfigManagement } from '@/hooks/calendarConfigs/useCalendarConfigManagement';
import { Navigate } from "react-router-dom";
import { usePermissions } from "@/hooks/auth/usePermissions";
import { PERMISSIONS } from "@/domain/constants/permissions";
import { PermissionGuard } from "@/ui/components/auth/PermissionGuard";

export function ConfigurationPage() {
  const { hasPermission } = usePermissions();

  if (!hasPermission(PERMISSIONS.CONFIGURATION_WRITE)) {
    return <Navigate to="/" replace />;
  }

  const { periods, createPeriod, activatePeriod } = usePeriodManagement();
  const { configs, selectedPeriodId, selectPeriod, createConfigs, updateConfig } = useCalendarConfigManagement();

  // Auto-select the active period on mount
  useEffect(() => {
    if (periods.length > 0 && !selectedPeriodId) {
      const activePeriod = periods.find(p => p.activeState);
      if (activePeriod) {
        selectPeriod(activePeriod.id);
      }
    }
  }, [periods, selectedPeriodId, selectPeriod]);

  // State for edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreatePeriodOpen, setIsCreatePeriodOpen] = useState(false);
  const [isCreateConfigOpen, setIsCreateConfigOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<{ id: string; noteNumber: number; startDate: string; endDate: string } | null>(null);

  // Local form state for creating new period
  const [newPeriod, setNewPeriod] = useState({
    name: '',
    initialDate: '',
    endDate: '',
    activeState: false
  });

  // Local form state for creating new calendar config
  const [newConfig, setNewConfig] = useState({
    noteNumber: 1,
    startDate: '',
    endDate: ''
  });

  const handleCreatePeriod = () => {
    if (!newPeriod.name || !newPeriod.initialDate || !newPeriod.endDate) {
      return;
    }

    createPeriod(newPeriod);
    setNewPeriod({ name: '', initialDate: '', endDate: '', activeState: false });
    setIsCreatePeriodOpen(false);
  };

  const handleActivatePeriod = (periodId: string) => {
    activatePeriod(periodId);
  };

  const handleCreateCalendarConfig = () => {
    if (!newConfig.startDate || !newConfig.endDate || !selectedPeriodId) {
      return;
    }

    // Convert dates to datetime format (API expects LocalDateTime)
    const startDateTime = `${newConfig.startDate}T00:00:00`;
    const endDateTime = `${newConfig.endDate}T23:59:59`;

    createConfigs({
      periodId: selectedPeriodId,
      noteNumber: newConfig.noteNumber,
      startDate: startDateTime,
      endDate: endDateTime
    });
    
    setNewConfig({ noteNumber: newConfig.noteNumber + 1, startDate: '', endDate: '' });
    setIsCreateConfigOpen(false);
  };

  const handleEditConfig = (config: any) => {
    // Extract date from datetime string
    const startDate = config.startDate.split('T')[0];
    const endDate = config.endDate.split('T')[0];
    
    setEditingConfig({
      id: config.id,
      noteNumber: config.noteNumber,
      startDate,
      endDate
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateConfig = () => {
    if (!editingConfig) return;

    const startDateTime = `${editingConfig.startDate}T00:00:00`;
    const endDateTime = `${editingConfig.endDate}T23:59:59`;

    updateConfig(editingConfig.id, {
      startDate: startDateTime,
      endDate: endDateTime
    });

    setIsEditDialogOpen(false);
    setEditingConfig(null);
  };

  const getConfigsForPeriod = (periodId: string) => {
    return configs.filter(c => c.periodId === periodId);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl md:text-3xl text-gray-900 font-bold">Configuración del Sistema</h2>
        <p className="text-sm md:text-base text-gray-600">
          Gestión de períodos académicos y configuración de cortes evaluativos
        </p>
      </div>

      <Tabs defaultValue="periods" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="periods" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Períodos Académicos</span>
            <span className="sm:hidden">Períodos</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Configuración de Cortes</span>
            <span className="sm:hidden">Cortes</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Períodos Académicos */}
        <TabsContent value="periods" className="space-y-6">

          {/* Lista de períodos */}
          <Card>
            <CardHeader>
              {/* Cambiamos a flex-col por defecto (móvil) y flex-row en sm o md */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <CardTitle>Períodos Registrados</CardTitle>
                  <CardDescription>
                    Gestiona los períodos académicos del sistema
                  </CardDescription>
                </div>
                
                <PermissionGuard permission={PERMISSIONS.CONFIGURATION_WRITE}>
                  {/* w-full para móvil, w-auto para pantallas más grandes */}
                  <Button 
                    onClick={() => setIsCreatePeriodOpen(true)} 
                    className="w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Período
                  </Button>
                </PermissionGuard>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {periods.map((period) => (
                  <div
                    key={period.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{period.name}</h3>
                        {period.activeState && (
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Activo
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(period.initialDate).toLocaleDateString('es-ES')} - {new Date(period.endDate).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!period.activeState && (
                        <PermissionGuard permission={PERMISSIONS.CONFIGURATION_WRITE}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActivatePeriod(period.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Activar
                          </Button>
                        </PermissionGuard>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Configuración de Cortes */}
        <TabsContent value="calendar" className="space-y-6">
          {/* Selector de período */}
          {/* Selector de período y botón de nuevo corte */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Cortes</CardTitle>
              <CardDescription>
                Selecciona un período para ver y gestionar sus cortes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="space-y-2 flex-1">
                  <select
                    id="period"
                    className="w-full px-3 py-2 border rounded-md"
                    value={selectedPeriodId || ''}
                    onChange={(e) => selectPeriod(e.target.value)}
                  >
                    <option value="">Seleccionar período</option>
                    {periods.map((period) => (
                      <option key={period.id} value={period.id}>
                        {period.name} ({period.activeState ? 'Activo' : 'Inactivo'})
                      </option>
                    ))}
                  </select>
                </div>
                <PermissionGuard permission={PERMISSIONS.CONFIGURATION_WRITE}>
                  <Button 
                    onClick={() => setIsCreateConfigOpen(true)}
                    disabled={!selectedPeriodId}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Corte
                  </Button>
                </PermissionGuard>
              </div>
            </CardContent>
          </Card>

          {/* Lista de configuraciones */}
          <Card>
            <CardHeader>
              <CardTitle>Configuraciones de Cortes</CardTitle>
              <CardDescription>
                Cortes configurados por período académico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {periods.map((period) => {
                  const periodConfigs = getConfigsForPeriod(period.id);
                  if (periodConfigs.length === 0) return null;

                  return (
                    <div key={period.id} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{period.name}</h3>
                        {period.activeState && (
                          <Badge variant="default" className="bg-green-600">Activo</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {periodConfigs.sort((a, b) => a.noteNumber - b.noteNumber).map((config) => (
                          <div
                            key={config.id}
                            className="p-4 border rounded-lg space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">Corte {config.noteNumber}</h4>
                              <PermissionGuard permission={PERMISSIONS.CONFIGURATION_WRITE}>
                                <Button variant="ghost" size="sm" onClick={() => handleEditConfig(config)}>
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              </PermissionGuard>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>Inicio: {new Date(config.startDate).toLocaleDateString('es-ES')}</p>
                              <p>Fin: {new Date(config.endDate).toLocaleDateString('es-ES')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Config Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Configuración de Corte {editingConfig?.noteNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editStartDate">Fecha de Inicio *</Label>
              <Input
                id="editStartDate"
                type="date"
                value={editingConfig?.startDate || ''}
                onChange={(e) => setEditingConfig(editingConfig ? { ...editingConfig, startDate: e.target.value } : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEndDate">Fecha de Fin *</Label>
              <Input
                id="editEndDate"
                type="date"
                value={editingConfig?.endDate || ''}
                onChange={(e) => setEditingConfig(editingConfig ? { ...editingConfig, endDate: e.target.value } : null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateConfig}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Period Dialog */}
      <Dialog open={isCreatePeriodOpen} onOpenChange={setIsCreatePeriodOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Período Académico</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="space-y-2">
                  <Label htmlFor="periodName">Nombre del Período *</Label>
                  <Input
                    id="periodName"
                    placeholder="Ej: 2024-1"
                    value={newPeriod.name}
                    onChange={(e) => setNewPeriod({ ...newPeriod, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estado Inicial</Label>
                  <div className="flex items-center gap-2 h-10">
                    <input
                      type="checkbox"
                      checked={newPeriod.activeState}
                      onChange={(e) => setNewPeriod({ ...newPeriod, activeState: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-600">
                      {newPeriod.activeState ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
               <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="initialDate">Fecha de Inicio *</Label>
                  <Input
                    id="initialDate"
                    type="date"
                    value={newPeriod.initialDate}
                    onChange={(e) => setNewPeriod({ ...newPeriod, initialDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha de Fin *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newPeriod.endDate}
                    onChange={(e) => setNewPeriod({ ...newPeriod, endDate: e.target.value })}
                  />
                </div>
              </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatePeriodOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreatePeriod}>Crear Período</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Calendar Config Dialog */}
      <Dialog open={isCreateConfigOpen} onOpenChange={setIsCreateConfigOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Configuración de Corte</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="space-y-2">
                 <Label>Período Académico</Label>
                 <div className="p-2 border rounded bg-gray-50 text-sm">
                   {periods.find(p => p.id === selectedPeriodId)?.name || 'Seleccione un período primero'}
                 </div>
             </div>
             
                <div className="space-y-2">
                  <Label htmlFor="noteNumber">Número de Corte *</Label>
                  <Input
                    id="noteNumber"
                    type="number"
                    min="1"
                    value={newConfig.noteNumber}
                    onChange={(e) => setNewConfig({ ...newConfig, noteNumber: parseInt(e.target.value) })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="configStartDate">Fecha de Inicio *</Label>
                  <Input
                    id="configStartDate"
                    type="date"
                    value={newConfig.startDate}
                    onChange={(e) => setNewConfig({ ...newConfig, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="configEndDate">Fecha de Fin *</Label>
                  <Input
                    id="configEndDate"
                    type="date"
                    value={newConfig.endDate}
                    onChange={(e) => setNewConfig({ ...newConfig, endDate: e.target.value })}
                  />
                </div>
                </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsCreateConfigOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateCalendarConfig}>Crear Configuración</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
