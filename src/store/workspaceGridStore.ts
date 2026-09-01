import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ModuleType = 'browser' | 'notes' | 'tasks';

export interface Task {
  id: string;
  label: string;
  done: boolean;
}

export interface BrowserTab {
  id: string;
  url: string;
  title?: string;
  favicon?: string;
}

export interface WorkspaceModule {
  id: string;
  type: ModuleType;
  x: number;
  y: number;
  w: number;
  h: number;
  content?: string;
  tasks?: Task[];
  tabs?: BrowserTab[];
  activeTabId?: string;
}

interface WorkspaceState {
  modules: WorkspaceModule[];
  addModule: (module: WorkspaceModule) => void;
  removeModule: (id: string) => void;
  setModules: (modules: WorkspaceModule[]) => void;
  updateModuleContent: (id: string, content: string) => void;
  addTask: (moduleId: string, label: string) => void;
  toggleTask: (moduleId: string, taskId: string) => void;
  removeTask: (moduleId: string, taskId: string) => void;
  addBrowserTab: (moduleId: string, url: string) => void;
  closeBrowserTab: (moduleId: string, tabId: string) => void;
  setActiveBrowserTab: (moduleId: string, tabId: string) => void;
  navigateBrowserTab: (moduleId: string, tabId: string, url: string) => void;
  updateBrowserTabMeta: (moduleId: string, tabId: string, meta: { title?: string; favicon?: string }) => void;
  isAddModuleModalOpen: boolean;
  openAddModuleModal: () => void;
  closeAddModuleModal: () => void;
  settingsModuleId: string | null;
  openModuleSettings: (moduleId: string) => void;
  closeModuleSettings: () => void;
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
      addTask: (moduleId, label) =>
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id === moduleId
              ? { ...m, tasks: [...(m.tasks ?? []), { id: crypto.randomUUID(), label, done: false }] }
              : m
          ),
        })),
      toggleTask: (moduleId, taskId) =>
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id === moduleId
              ? {
                  ...m,
                  tasks: (m.tasks ?? []).map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
                }
              : m
          ),
        })),
      removeTask: (moduleId, taskId) =>
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id === moduleId ? { ...m, tasks: (m.tasks ?? []).filter((t) => t.id !== taskId) } : m
          ),
        })),
      addBrowserTab: (moduleId, url) =>
        set((state) => ({
          modules: state.modules.map((m) => {
            if (m.id !== moduleId) return m;
            const newTab: BrowserTab = { id: crypto.randomUUID(), url };
            return { ...m, tabs: [...(m.tabs ?? []), newTab], activeTabId: newTab.id };
          }),
        })),
      closeBrowserTab: (moduleId, tabId) =>
        set((state) => ({
          modules: state.modules.map((m) => {
            if (m.id !== moduleId) return m;
            const tabs = (m.tabs ?? []).filter((t) => t.id !== tabId);
            const activeTabId = m.activeTabId === tabId ? tabs[tabs.length - 1]?.id : m.activeTabId;
            return { ...m, tabs, activeTabId };
          }),
        })),
      setActiveBrowserTab: (moduleId, tabId) =>
        set((state) => ({
          modules: state.modules.map((m) => (m.id === moduleId ? { ...m, activeTabId: tabId } : m)),
        })),
      navigateBrowserTab: (moduleId, tabId, url) =>
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id === moduleId
              ? { ...m, tabs: (m.tabs ?? []).map((t) => (t.id === tabId ? { ...t, url } : t)) }
              : m
          ),
        })),
      updateBrowserTabMeta: (moduleId, tabId, meta) =>
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id === moduleId
              ? { ...m, tabs: (m.tabs ?? []).map((t) => (t.id === tabId ? { ...t, ...meta } : t)) }
              : m
          ),
        })),
      isAddModuleModalOpen: false,
      openAddModuleModal: () => set({ isAddModuleModalOpen: true }),
      closeAddModuleModal: () => set({ isAddModuleModalOpen: false }),
      settingsModuleId: null,
      openModuleSettings: (moduleId) => set({ settingsModuleId: moduleId }),
      closeModuleSettings: () => set({ settingsModuleId: null }),
    }),
    {
      name: 'weaver-workspace',
      partialize: (state) => ({ modules: state.modules }),
    }
  )
);
