import { create } from 'zustand';

export type ModuleType = 'browser' | 'notes' | 'tasks';

export interface WorkspaceModule {
  id: string;
  type: ModuleType;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface WorkspaceState {
  modules: WorkspaceModule[];
  addModule: (module: WorkspaceModule) => void;
  removeModule: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  modules: [],
  addModule: (module) =>
    set((state) => ({ modules: [...state.modules, module] })),
  removeModule: (id) =>
    set((state) => ({ modules: state.modules.filter((m) => m.id !== id) })),
}));
