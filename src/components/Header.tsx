import { useState } from 'react';
import { useWorkspaceStore } from '../store/workspaceGridStore';

export default function Header() {
  const openAddModuleModal = useWorkspaceStore((state) => state.openAddModuleModal);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const setActiveWorkspace = useWorkspaceStore((state) => state.setActiveWorkspace);
  const addWorkspace = useWorkspaceStore((state) => state.addWorkspace);

  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  const handleAddWorkspace = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const value = e.currentTarget.value.trim();
    if (!value) return;
    addWorkspace(value);
    e.currentTarget.value = '';
    setIsSwitcherOpen(false);
  };

  return (
    <div className="flex items-center sticky top-0 z-10 justify-between bg-white border-b border-border-subtle px-4 py-4 mr-[-14px]">
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsSwitcherOpen((open) => !open)}
          className="flex items-center gap-1 cursor-pointer text-lg font-semibold text-text-gray hover:text-light-black"
        >
          {activeWorkspace?.name ?? 'Workspace'}
          <span className="text-xs">▾</span>
        </button>
        {isSwitcherOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsSwitcherOpen(false)} />
            <div className="absolute left-0 top-full z-20 mt-2 rounded-md border border-border-subtle bg-white shadow-md">
              <ul className="max-h-60 overflow-auto py-1">
                {workspaces.map((workspace) => (
                  <li key={workspace.id}>
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
                  </li>
                ))}
              </ul>
              <input
                type="text"
                onKeyDown={handleAddWorkspace}
                placeholder="New workspace name"
                className="w-full border-t border-border-subtle px-3 py-2 text-sm outline-none placeholder:text-text-gray"
              />
            </div>
          </>
        )}
      </div>
      <button
        onClick={openAddModuleModal}
        className="flex items-center cursor-pointer gap-2 rounded-md bg-primary-purple px-[14px] py-[9px] text-sm font-medium text-white hover:bg-primary-purple/80"
      >
        <img src="/icons/add.svg" alt="" className="w-4" />
        Add Module
      </button>
    </div>
  );
}
