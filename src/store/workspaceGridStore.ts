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
  content?: string;
}

interface WorkspaceState {
  modules: WorkspaceModule[];
  addModule: (module: WorkspaceModule) => void;
  removeModule: (id: string) => void;
  setModules: (modules: WorkspaceModule[]) => void;
  updateModuleContent: (id: string, content: string) => void;
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
      updateModuleContent: (id, content) =>
        set((state) => ({
          modules: state.modules.map((m) => (m.id === id ? { ...m, content } : m)),
        })),
    }),
    { name: 'weaver-workspace' }
  )
);
