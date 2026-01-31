export interface Program {
  id: string;
  name: string;
  code?: string;
  duration?: number;
  credits?: number;
  coordinatorId: string;
}
