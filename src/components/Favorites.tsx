import { useState } from 'react';
import { useWorkspaceStore } from '../store/workspaceGridStore';

function formatFavoritedDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Favorites() {
  const profile = useWorkspaceStore((state) => state.profile);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const setActiveWorkspace = useWorkspaceStore((state) => state.setActiveWorkspace);
  const setActiveView = useWorkspaceStore((state) => state.setActiveView);
  const toggleWorkspaceFavorited = useWorkspaceStore((state) => state.toggleWorkspaceFavorited);
  const accentColor = profile.accentColor ?? '#6366F1';
  const [query, setQuery] = useState('');

  const favoritedWorkspaces = workspaces
    .filter((w) => w.favorited)
    .filter((w) => w.name.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => {
      const aTime = new Date(a.lastActivityAt ?? a.favoritedAt ?? 0).getTime();
      const bTime = new Date(b.lastActivityAt ?? b.favoritedAt ?? 0).getTime();
      return bTime - aTime;
    });

  const totalModules = workspaces
    .filter((w) => w.favorited)
    .reduce((sum, w) => sum + w.modules.length, 0);

  const openWorkspace = (id: string) => {
    setActiveWorkspace(id);
    setActiveView('workspace');
  };

  return (
    <div className="flex-1 overflow-auto mr-[-14px]">
      <div className="p-8 pb-6 pt-[28px] bg-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Favorites</h1>
            <p className="mt-1 text-sm text-text-gray">
              Keep your most important workspaces within easy reach.
            </p>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 bg-text-gray [mask-image:url('/icons/search.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search favorites..."
              className="w-64 rounded-md border border-border-subtle bg-secondary-gray py-[9px] pl-9 pr-3 text-sm outline-none placeholder:text-text-gray"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 text-sm text-text-gray">
          <span className="text-black">
            {favoritedWorkspaces.length} workspace{favoritedWorkspaces.length === 1 ? '' : 's'}
          </span>
          <span className="text-border-subtle">|</span>
          <span>{totalModules} modules total</span>
        </div>
      </div>
      <div className="border-t border-border-subtle p-8 pt-6">
        <div className="mb-[14px] flex items-center justify-between">
          <h4 className="font-semibold text-sm">Favorited Workspaces</h4>
          {favoritedWorkspaces.length > 0 && (
            <span className="text-xs text-text-gray">Sorted by recent activity</span>
          )}
        </div>
        {favoritedWorkspaces.length === 0 ? (
          <p className="text-sm text-text-gray">No favorited workspaces yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {favoritedWorkspaces.map((workspace) => {
              const cardAccent = workspace.accentColor ?? '#6366F1';
              return (
                <div
                  key={workspace.id}
                  onClick={() => openWorkspace(workspace.id)}
                  className="cursor-pointer rounded-lg bg-white p-4 shadow-subtle transition-shadow hover:shadow-xl"
                >
                  <p className="font-semibold">{workspace.name}</p>
                  <p className="mt-1 text-sm text-text-gray">
                    {workspace.modules.length} module{workspace.modules.length === 1 ? '' : 's'}
                    {workspace.favoritedAt && <> &middot; Favorited {formatFavoritedDate(workspace.favoritedAt)}</>}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-border-subtle pt-3">
                    <span
                      style={{ backgroundColor: `${cardAccent}1a`, color: cardAccent }}
                      className="rounded-full px-3 py-1 text-xs font-medium"
                    >
                      Favorited
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWorkspaceFavorited(workspace.id);
                      }}
                      style={{ color: accentColor }}
                      className="cursor-pointer text-sm font-medium hover:opacity-80 flex items-center"
                    >
                      Unfavorite
                      <img src="/icons/right-caret.svg" alt="" className="h-3.5 w-3.5 inline-block ml-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
