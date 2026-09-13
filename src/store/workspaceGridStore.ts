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
  name?: string;
  locked?: boolean;
  color?: string;
}

export type BackgroundTint = 'default' | 'warm' | 'cool' | 'pure';
export type ModuleStyle = 'rounded' | 'sharp' | 'pill';

export const BACKGROUND_TINT_COLORS: Record<BackgroundTint, string> = {
  default: '#F7F7FA',
  warm: '#F5EBDD',
  cool: '#E3ECF7',
  pure: '#FFFFFF',
};

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  accentColor?: string;
  backgroundTint?: BackgroundTint;
  moduleStyle?: ModuleStyle;
  modules: WorkspaceModule[];
}

type WorkspaceSettings = Partial<
  Pick<Workspace, 'name' | 'description' | 'accentColor' | 'backgroundTint' | 'moduleStyle'>
>;

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  addWorkspace: () => void;
  removeWorkspace: (id: string) => void;
  renameWorkspace: (id: string, name: string) => void;
  updateWorkspace: (id: string, updates: WorkspaceSettings) => void;
  setActiveWorkspace: (id: string) => void;

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
  isWorkspaceSettingsOpen: boolean;
  openWorkspaceSettings: () => void;
  closeWorkspaceSettings: () => void;
  renameModule: (id: string, name: string) => void;
  toggleModuleLock: (id: string) => void;
  duplicateModule: (id: string) => void;
  updateModuleColor: (id: string, color: string | undefined) => void;
}

function updateActiveWorkspaceModules(
  state: WorkspaceState,
  updater: (modules: WorkspaceModule[]) => WorkspaceModule[]
): Workspace[] {
  return state.workspaces.map((w) =>
    w.id === state.activeWorkspaceId ? { ...w, modules: updater(w.modules) } : w
  );
}

const defaultWorkspaceId = crypto.randomUUID();

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      workspaces: [{ id: defaultWorkspaceId, name: 'My Workspace', modules: [] }],
      activeWorkspaceId: defaultWorkspaceId,
      addWorkspace: () =>
        set((state) => {
          const id = crypto.randomUUID();
          const name = `Workspace ${state.workspaces.length + 1}`;
          return {
            workspaces: [...state.workspaces, { id, name, modules: [] }],
            activeWorkspaceId: id,
          };
        }),
      removeWorkspace: (id) =>
        set((state) => {
          if (state.workspaces.length <= 1) return state;
          const workspaces = state.workspaces.filter((w) => w.id !== id);
          const activeWorkspaceId =
            state.activeWorkspaceId === id ? workspaces[0].id : state.activeWorkspaceId;
          return { workspaces, activeWorkspaceId };
        }),
      renameWorkspace: (id, name) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) => (w.id === id ? { ...w, name } : w)),
        })),
      updateWorkspace: (id, updates) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        })),
      setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),

      addModule: (module) =>
        set((state) => ({
          workspaces: updateActiveWorkspaceModules(state, (modules) => [...modules, module]),
        })),
      removeModule: (id) =>
        set((state) => ({
          workspaces: updateActiveWorkspaceModules(state, (modules) =>
            modules.filter((m) => m.id !== id)
          ),
        })),
      setModules: (modules) =>
        set((state) => ({
          workspaces: updateActiveWorkspaceModules(state, () => modules),
        })),
      updateModuleContent: (id, content) =>
        set((state) => ({
          workspaces: updateActiveWorkspaceModules(state, (modules) =>
            modules.map((m) => (m.id === id ? { ...m, content } : m))
          ),
        })),
      addTask: (moduleId, label) =>
        set((state) => ({
          workspaces: updateActiveWorkspaceModules(state, (modules) =>
            modules.map((m) =>
              m.id === moduleId
                ? { ...m, tasks: [...(m.tasks ?? []), { id: crypto.randomUUID(), label, done: false }] }
                : m
            )
          ),
        })),
      toggleTask: (moduleId, taskId) =>
        set((state) => ({
          workspaces: updateActiveWorkspaceModules(state, (modules) =>
            modules.map((m) =>
              m.id === moduleId
                ? {
                    ...m,
                    tasks: (m.tasks ?? []).map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
                  }
                : m
            )
          ),
        })),
      removeTask: (moduleId, taskId) =>
        set((state) => ({
          workspaces: updateActiveWorkspaceModules(state, (modules) =>
            modules.map((m) =>
              m.id === moduleId ? { ...m, tasks: (m.tasks ?? []).filter((t) => t.id !== taskId) } : m
            )
          ),
        })),
      addBrowserTab: (moduleId, url) =>
        set((state) => ({
          workspaces: updateActiveWorkspaceModules(state, (modules) =>
            modules.map((m) => {
              if (m.id !== moduleId) return m;
              const newTab: BrowserTab = { id: crypto.randomUUID(), url };
              return { ...m, tabs: [...(m.tabs ?? []), newTab], activeTabId: newTab.id };
            })
          ),
        })),
      closeBrowserTab: (moduleId, tabId) =>
        set((state) => ({
          workspaces: updateActiveWorkspaceModules(state, (modules) =>
            modules.map((m) => {
              if (m.id !== moduleId) return m;
              const tabs = (m.tabs ?? []).filter((t) => t.id !== tabId);
              const activeTabId = m.activeTabId === tabId ? tabs[tabs.length - 1]?.id : m.activeTabId;
              return { ...m, tabs, activeTabId };
            })
          ),
        })),
      setActiveBrowserTab: (moduleId, tabId) =>
        set((state) => ({
          workspaces: updateActiveWorkspaceModules(state, (modules) =>
            modules.map((m) => (m.id === moduleId ? { ...m, activeTabId: tabId } : m))
          ),
        })),
      navigateBrowserTab: (moduleId, tabId, url) =>
        set((state) => ({
          workspaces: updateActiveWorkspaceModules(state, (modules) =>
            modules.map((m) =>
              m.id === moduleId
                ? { ...m, tabs: (m.tabs ?? []).map((t) => (t.id === tabId ? { ...t, url } : t)) }
                : m
            )
          ),
        })),
      updateBrowserTabMeta: (moduleId, tabId, meta) =>
        set((state) => ({
          workspaces: updateActiveWorkspaceModules(state, (modules) =>
            modules.map((m) =>
              m.id === moduleId
                ? { ...m, tabs: (m.tabs ?? []).map((t) => (t.id === tabId ? { ...t, ...meta } : t)) }
                : m
            )
          ),
        })),
      isAddModuleModalOpen: false,
      openAddModuleModal: () => set({ isAddModuleModalOpen: true }),
      closeAddModuleModal: () => set({ isAddModuleModalOpen: false }),
      settingsModuleId: null,
      openModuleSettings: (moduleId) => set({ settingsModuleId: moduleId }),
      closeModuleSettings: () => set({ settingsModuleId: null }),
      isWorkspaceSettingsOpen: false,
      openWorkspaceSettings: () => set({ isWorkspaceSettingsOpen: true }),
      closeWorkspaceSettings: () => set({ isWorkspaceSettingsOpen: false }),
      renameModule: (id, name) =>
        set((state) => ({
          workspaces: updateActiveWorkspaceModules(state, (modules) =>
            modules.map((m) => (m.id === id ? { ...m, name } : m))
          ),
        })),
      toggleModuleLock: (id) =>
        set((state) => ({
          workspaces: updateActiveWorkspaceModules(state, (modules) =>
            modules.map((m) => (m.id === id ? { ...m, locked: !m.locked } : m))
          ),
        })),
      duplicateModule: (id) =>
        set((state) => ({
          workspaces: updateActiveWorkspaceModules(state, (modules) => {
            const original = modules.find((m) => m.id === id);
            if (!original) return modules;

            const tabs = original.tabs?.map((t) => ({ ...t, id: crypto.randomUUID() }));
            const activeTabId = tabs?.find((_, i) => original.tabs?.[i]?.id === original.activeTabId)?.id;

            const copy: WorkspaceModule = {
              ...original,
              id: crypto.randomUUID(),
              tasks: original.tasks?.map((t) => ({ ...t })),
              tabs,
              activeTabId,
            };

            return [...modules, copy];
          }),
        })),
      updateModuleColor: (id, color) =>
        set((state) => ({
          workspaces: updateActiveWorkspaceModules(state, (modules) =>
            modules.map((m) => (m.id === id ? { ...m, color } : m))
          ),
        })),
    }),
    {
      name: 'weaver-workspace',
      partialize: (state) => ({ workspaces: state.workspaces, activeWorkspaceId: state.activeWorkspaceId }),
    }
  )
);

export const useActiveWorkspaceModules = () =>
  useWorkspaceStore(
    (state) => state.workspaces.find((w) => w.id === state.activeWorkspaceId)?.modules ?? []
  );
