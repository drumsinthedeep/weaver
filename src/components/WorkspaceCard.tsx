import { Workspace } from '../store/workspaceGridStore';

interface WorkspaceCardProps {
  workspace: Workspace;
  accentColor: string;
  onClick: () => void;
}

function formatLastOpened(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  return `${diffWeeks}w ago`;
}

export default function WorkspaceCard({ workspace, accentColor, onClick }: WorkspaceCardProps) {
  const taskModules = workspace.modules.filter((m) => m.type === 'tasks');
  const allTasks = taskModules.flatMap((m) => m.tasks ?? []);
  const doneTasks = allTasks.filter((t) => t.done).length;

  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-lg bg-white p-4 text-left shadow-subtle transition-shadow hover:shadow-xl"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold">{workspace.name}</p>
        {workspace.lastOpenedAt && (
          <p className="shrink-0 text-xs text-text-gray">{formatLastOpened(workspace.lastOpenedAt)}</p>
        )}
      </div>
      <p className="text-sm text-text-gray">
        {workspace.modules.length} module{workspace.modules.length === 1 ? '' : 's'}
      </p>
      {allTasks.length > 0 && (
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-hover-gray">
            <div
              className="h-full rounded-full"
              style={{ width: `${(doneTasks / allTasks.length) * 100}%`, backgroundColor: accentColor }}
            />
          </div>
          <p className="mt-1 text-xs text-text-gray">
            {doneTasks}/{allTasks.length} tasks complete
          </p>
        </div>
      )}
    </button>
  );
}
