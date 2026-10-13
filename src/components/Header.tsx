import { useState } from 'react';
import { useWorkspaceStore } from '../store/workspaceGridStore';

export default function Header() {
  const openAddModuleModal = useWorkspaceStore((state) => state.openAddModuleModal);
  const openSearch = useWorkspaceStore((state) => state.openSearch);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const setActiveWorkspace = useWorkspaceStore((state) => state.setActiveWorkspace);
  const addWorkspace = useWorkspaceStore((state) => state.addWorkspace);
  const openWorkspaceSettings = useWorkspaceStore((state) => state.openWorkspaceSettings);
  const renameWorkspace = useWorkspaceStore((state) => state.renameWorkspace);
  const toggleWorkspaceFavorited = useWorkspaceStore((state) => state.toggleWorkspaceFavorited);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [renamingWorkspaceId, setRenamingWorkspaceId] = useState<string | null>(null);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const accentColor = activeWorkspace?.accentColor ?? '#6366F1';
  const switchableWorkspaces = workspaces.filter((w) => !w.archived || w.id === activeWorkspaceId);

  const handleAddWorkspace = () => {
    addWorkspace();
    setRenamingWorkspaceId(useWorkspaceStore.getState().activeWorkspaceId);
  };

  const commitRename = (id: string, value: string, fallback: string) => {
    renameWorkspace(id, value.trim() || fallback);
    setRenamingWorkspaceId(null);
  };

  return (
    <div className="flex items-center sticky top-0 z-10 justify-between bg-white border-b border-border-subtle px-4 py-4 mr-[-14px]">
      <div className="relative flex items-center gap-1">
        <button
          type="button"
          onClick={() => setIsSwitcherOpen((open) => !open)}
          className={`${isSwitcherOpen ? 'text-light-black' : 'text-text-gray'} flex items-center gap-1 cursor-pointer text-lg font-semibold hover:text-light-black`}
        >
          {activeWorkspace?.name ?? 'Workspace'}
          <span className="text-xs">▾</span>
        </button>
        {activeWorkspace && (
          <button
            type="button"
            onClick={() => toggleWorkspaceFavorited(activeWorkspace.id)}
            title={activeWorkspace.favorited ? 'Unfavorite workspace' : 'Favorite workspace'}
            className="cursor-pointer rounded p-1 hover:bg-hover-gray"
          >
            <span
              className={`block h-4 w-4 [mask-image:url('/icons/star.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] ${
                activeWorkspace.favorited ? '' : 'bg-text-gray'
              }`}
              style={activeWorkspace.favorited ? { backgroundColor: accentColor } : undefined}
            />
          </button>
        )}
        {isSwitcherOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsSwitcherOpen(false)} />
            <div className="absolute left-0 top-full z-20 mt-2 w-56 rounded-md border border-border-subtle bg-white shadow-md">
              <span className="block px-4 pt-3 pb-1 text-xs font-semibold text-text-gray">WORKSPACES</span>
              <ul className="max-h-60 overflow-auto p-1">
                {switchableWorkspaces.map((workspace) => (
                  <li key={workspace.id}>
                    {renamingWorkspaceId === workspace.id ? (
                      <input
                        type="text"
                        autoFocus
                        defaultValue={workspace.name}
                        onFocus={(e) => e.target.select()}
                        onBlur={(e) => commitRename(workspace.id, e.target.value, workspace.name)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') e.currentTarget.blur();
                          if (e.key === 'Escape') setRenamingWorkspaceId(null);
                        }}
                        style={{ borderColor: accentColor }}
                        className="w-full rounded border px-3 py-2 text-sm outline-none"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveWorkspace(workspace.id);
                          setIsSwitcherOpen(false);
                        }}
                        style={workspace.id === activeWorkspaceId ? { color: accentColor } : undefined}
                        className={`flex w-full rounded items-center px-3 py-2 text-left text-sm cursor-pointer hover:bg-hover-gray ${
                          workspace.id === activeWorkspaceId ? 'font-semibold' : ''
                        }`}
                      >
                        {workspace.name}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              <div className="p-1 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={handleAddWorkspace}
                  className="flex rounded w-full items-center gap-2 px-3 py-2 text-left text-sm cursor-pointer hover:bg-hover-gray"
                >
                  <span
                    style={{ backgroundColor: `${accentColor}1a` }}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border-subtle"
                  >
                    <span
                      style={{ backgroundColor: accentColor }}
                      className="h-4 w-4 [mask-image:url('/icons/add.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]"
                    />
                  </span>
                  <span style={{ color: accentColor }}>New Workspace</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={openSearch}
          className="flex w-64 cursor-pointer items-center gap-2 rounded-md border border-border-subtle px-3 py-[9px] text-sm text-text-gray hover:bg-hover-gray"
        >
          <span className="h-4 w-4 shrink-0 bg-text-gray [mask-image:url('/icons/search.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]" />
          <span>Search workspace...</span>
          <span className="ml-auto rounded bg-hover-gray px-1.5 py-0.5 text-xs text-text-gray">⌘K</span>
        </button>
        <button className="flex items-center cursor-pointer gap-2 rounded-md px-[14px] py-[9px] text-sm font-medium hover:bg-hover-gray border-border-subtle border" onClick={openWorkspaceSettings}>
          <img src="/icons/sliders.svg" alt="" className="w-4" />
          Customize
        </button>
        <button
          onClick={openAddModuleModal}
          style={{ backgroundColor: accentColor }}
          className="flex items-center cursor-pointer gap-2 rounded-md px-[14px] py-[9px] text-sm font-medium text-white hover:opacity-90"
        >
          <img src="/icons/add.svg" alt="" className="w-4" />
          Add Module
        </button>
      </div>
    </div>
  );
}
