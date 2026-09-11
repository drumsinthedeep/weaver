import { useState } from 'react';
import { useWorkspaceStore } from '../store/workspaceGridStore';

export default function Header() {
  const openAddModuleModal = useWorkspaceStore((state) => state.openAddModuleModal);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const setActiveWorkspace = useWorkspaceStore((state) => state.setActiveWorkspace);
  const addWorkspace = useWorkspaceStore((state) => state.addWorkspace);
  const renameWorkspace = useWorkspaceStore((state) => state.renameWorkspace);

  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [renamingWorkspaceId, setRenamingWorkspaceId] = useState<string | null>(null);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

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
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsSwitcherOpen((open) => !open)}
          className={`${isSwitcherOpen ? 'text-light-black' : 'text-text-gray'} flex items-center gap-1 cursor-pointer text-lg font-semibold hover:text-light-black`}
        >
          {activeWorkspace?.name ?? 'Workspace'}
          <span className="text-xs">▾</span>
        </button>
        {isSwitcherOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsSwitcherOpen(false)} />
            <div className="absolute left-0 top-full z-20 mt-2 w-56 rounded-md border border-border-subtle bg-white shadow-md">
              <span className="block px-3 py-2 text-xs font-semibold text-text-gray">WORKSPACES</span>
              <ul className="max-h-60 overflow-auto py-1">
                {workspaces.map((workspace) => (
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
                        className="w-full rounded border border-primary-purple px-3 py-2 text-sm outline-none"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveWorkspace(workspace.id);
                          setIsSwitcherOpen(false);
                        }}
                        className={`flex w-full items-center px-3 py-2 text-left text-sm cursor-pointer hover:bg-hover-gray ${
                          workspace.id === activeWorkspaceId ? 'font-semibold text-primary-purple' : ''
                        }`}
                      >
                        {workspace.name}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={handleAddWorkspace}
                className="flex w-full items-center gap-2 border-t border-border-subtle px-3 py-2 text-left text-sm cursor-pointer hover:bg-hover-gray"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-primary-purple/10">
                  <span className="h-4 w-4 bg-primary-purple [mask-image:url('/icons/add.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]" />
                </span>
                <span className="text-primary-purple">New Workspace</span>
              </button>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center cursor-pointer gap-2 rounded-md px-[14px] py-[9px] text-sm font-medium hover:bg-hover-gray border-border-subtle border" onClick={() => useWorkspaceStore.getState().openModuleSettings()}>
          <img src="/icons/sliders.svg" alt="" className="w-4" />
          Customize
        </button>
        <button
          onClick={openAddModuleModal}
          className="flex items-center cursor-pointer gap-2 rounded-md bg-primary-purple px-[14px] py-[9px] text-sm font-medium text-white hover:bg-primary-purple/80"
        >
          <img src="/icons/add.svg" alt="" className="w-4" />
          Add Module
        </button>
      </div>
    </div>
  );
}
