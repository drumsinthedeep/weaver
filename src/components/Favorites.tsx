import { useWorkspaceStore } from '../store/workspaceGridStore';
import WorkspaceCard from './WorkspaceCard';

export default function Favorites() {
  const profile = useWorkspaceStore((state) => state.profile);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const setActiveWorkspace = useWorkspaceStore((state) => state.setActiveWorkspace);
  const setActiveView = useWorkspaceStore((state) => state.setActiveView);
  const accentColor = profile.accentColor ?? '#6366F1';
  const favoritedWorkspaces = workspaces.filter((w) => w.favorited);

  const openWorkspace = (id: string) => {
    setActiveWorkspace(id);
    setActiveView('workspace');
  };

  return (
    <div className="flex-1 overflow-auto mr-[-14px]">
      <div className="p-8 pb-6 pt-[28px] bg-white">
        <h1 className="text-3xl font-semibold">Favorites</h1>
        <p className="mt-1 text-sm text-text-gray">
          {favoritedWorkspaces.length} favorited workspace{favoritedWorkspaces.length === 1 ? '' : 's'}.
        </p>
      </div>
      <div className="border-t border-border-subtle p-8 pt-6">
        {favoritedWorkspaces.length === 0 ? (
          <p className="text-sm text-text-gray">No favorited workspaces yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {favoritedWorkspaces.map((workspace) => (
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
