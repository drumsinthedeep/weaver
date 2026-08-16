import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  setModules: (modules: WorkspaceModule[]) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      modules: [],
      addModule: (module) =>
        set((state) => ({ modules: [...state.modules, module] })),
      removeModule: (id) =>
        set((state) => ({ modules: state.modules.filter((m) => m.id !== id) })),
      setModules: (modules) => set({ modules }),
    }),
    { name: 'weaver-workspace' }
  )
);
