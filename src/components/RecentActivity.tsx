import { useWorkspaceStore, ActivityType } from '../store/workspaceGridStore';
import { formatRelativeTime } from '../lib/formatRelativeTime';

const ACTIVITY_ICON: Record<ActivityType, string> = {
  task_completed: '/icons/check.svg',
  task_added: '/icons/tasks.svg',
  task_removed: '/icons/tasks.svg',
  note_edited: '/icons/notes.svg',
  bookmark_added: '/icons/bookmark.svg',
  file_added: '/icons/folder.svg',
  event_created: '/icons/calendar.svg',
  event_removed: '/icons/calendar.svg',
  browser_tab_added: '/icons/browser.svg',
  module_added: '/icons/grid.svg',
  module_removed: '/icons/grid.svg',
};

function describeActivity(type: ActivityType, count: number): string {
  switch (type) {
    case 'task_completed':
      return 'Task marked complete';
    case 'task_added':
      return count === 1 ? 'Task added' : `${count} tasks added`;
    case 'task_removed':
      return count === 1 ? 'Task removed' : `${count} tasks removed`;
    case 'note_edited':
      return 'Notes edited';
    case 'bookmark_added':
      return count === 1 ? 'Bookmark saved' : `${count} bookmarks saved`;
    case 'file_added':
      return count === 1 ? 'File added' : `${count} files added`;
    case 'event_created':
      return 'Calendar event created';
    case 'event_removed':
      return 'Calendar event removed';
    case 'browser_tab_added':
      return count === 1 ? 'Browser tab added' : 'Browser tabs updated';
    case 'module_added':
      return count === 1 ? 'Module added' : `${count} modules added`;
    case 'module_removed':
      return count === 1 ? 'Module removed' : `${count} modules removed`;
  }
}

export default function RecentActivity() {
  const activityLog = useWorkspaceStore((state) => state.activityLog);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const setActiveWorkspace = useWorkspaceStore((state) => state.setActiveWorkspace);
  const setActiveView = useWorkspaceStore((state) => state.setActiveView);

  const entries = activityLog.slice(0, 8);

  const openWorkspace = (id: string) => {
    setActiveWorkspace(id);
    setActiveView('workspace');
  };

  return (
    <div>
      <h4 className="mb-[14px] font-semibold text-sm">Recent Activity</h4>
      {entries.length === 0 ? (
        <p className="text-sm text-text-gray">No activity yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {entries.map((entry) => {
            const workspace = workspaces.find((w) => w.id === entry.workspaceId);
            return (
              <div key={entry.id} className="flex items-start gap-2">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary-gray">
                  <span
                    className="h-3.5 w-3.5 bg-text-gray [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]"
                    style={{ maskImage: `url(${ACTIVITY_ICON[entry.type]})` }}
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{describeActivity(entry.type, entry.count)}</p>
                  <p className="text-xs text-text-gray">
                    {workspace ? (
                      <button
                        type="button"
                        onClick={() => openWorkspace(workspace.id)}
                        style={{ color: workspace.accentColor ?? '#6366F1' }}
                        className="cursor-pointer font-medium hover:underline"
                      >
                        {workspace.name}
                      </button>
                    ) : (
                      'Deleted workspace'
                    )}
                    {' · '}
                    {formatRelativeTime(entry.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
