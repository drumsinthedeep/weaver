import { useWorkspaceStore } from '../store/workspaceGridStore';
import WorkspaceCard from './WorkspaceCard';

export default function Archive() {
  const profile = useWorkspaceStore((state) => state.profile);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const setActiveWorkspace = useWorkspaceStore((state) => state.setActiveWorkspace);
  const setActiveView = useWorkspaceStore((state) => state.setActiveView);
  const accentColor = profile.accentColor ?? '#6366F1';
  const archivedWorkspaces = workspaces.filter((w) => w.archived);

  const openWorkspace = (id: string) => {
    setActiveWorkspace(id);
    setActiveView('workspace');
  };

  return (
    <div className="flex-1 overflow-auto mr-[-14px]">
      <div className="p-8 pb-6 pt-[28px] bg-white">
        <h1 className="text-3xl font-semibold">Archive</h1>
        <p className="mt-1 text-sm text-text-gray">
          {archivedWorkspaces.length} archived workspace{archivedWorkspaces.length === 1 ? '' : 's'}.
        </p>
      </div>
      <div className="border-t border-border-subtle p-8 pt-6">
        {archivedWorkspaces.length === 0 ? (
          <p className="text-sm text-text-gray">No archived workspaces yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {archivedWorkspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace.id}
                workspace={workspace}
                accentColor={accentColor}
                onClick={() => openWorkspace(workspace.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
