import { useWorkspaceStore } from '../store/workspaceGridStore';

export default function WorkspaceSettingsModal() {
  const isOpen = useWorkspaceStore((state) => state.isWorkspaceSettingsOpen);
  const closeWorkspaceSettings = useWorkspaceStore((state) => state.closeWorkspaceSettings);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const renameWorkspace = useWorkspaceStore((state) => state.renameWorkspace);
  const removeWorkspace = useWorkspaceStore((state) => state.removeWorkspace);

  const workspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const canDelete = workspaces.length > 1;

  const handleDelete = () => {
    if (!workspace) return;
    removeWorkspace(workspace.id);
    closeWorkspaceSettings();
  };

  return (
    <>
      <div
        onClick={closeWorkspaceSettings}
        className={`fixed inset-0 z-10 bg-gray-500/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        className={`fixed top-1/2 left-1/2 z-20 w-100 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-border-subtle bg-white shadow-md transition-all duration-200 flex flex-col ${
          isOpen ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          <h1 className="text-[18px]">Workspace Settings</h1>
          <button
            className="p-[6px] rounded border border-border-subtle hover:bg-hover-gray cursor-pointer"
            onClick={closeWorkspaceSettings}
          >
            <img src="/icons/close.svg" alt="Close" className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <div>
            <label className="mb-1 block text-[14px] font-medium text-text-gray">Name</label>
            <input
              key={workspace?.id}
              type="text"
              defaultValue={workspace?.name ?? ''}
              onBlur={(e) =>
                workspace && renameWorkspace(workspace.id, e.target.value.trim() || workspace.name)
              }
              className="w-full rounded border border-gray-200 px-2 py-1 text-sm outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end border-t border-border-subtle p-4">
          <button
            type="button"
            disabled={!canDelete}
            onClick={handleDelete}
            title={!canDelete ? "You can't delete your only workspace" : undefined}
            className="flex items-center gap-2 rounded-md bg-danger px-[14px] py-[9px] text-sm font-medium text-white hover:bg-danger/80 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete Workspace
          </button>
        </div>
      </div>
    </>
  );
}
