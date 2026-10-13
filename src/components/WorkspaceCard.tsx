import { Workspace } from '../store/workspaceGridStore';

interface WorkspaceCardProps {
  workspace: Workspace;
  accentColor: string;
  onClick: () => void;
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
      <p className="font-semibold">{workspace.name}</p>
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
