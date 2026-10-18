import { useWorkspaceStore } from '../store/workspaceGridStore';
import WorkspaceCard from './WorkspaceCard';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const DATE_LABEL = new Date()
  .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  .toUpperCase();

export default function Home() {
  const profile = useWorkspaceStore((state) => state.profile);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const addWorkspace = useWorkspaceStore((state) => state.addWorkspace);
  const setActiveWorkspace = useWorkspaceStore((state) => state.setActiveWorkspace);
  const setActiveView = useWorkspaceStore((state) => state.setActiveView);
  const accentColor = profile.accentColor ?? '#6366F1';
  const visibleWorkspaces = workspaces
    .filter((w) => !w.archived)
    .sort((a, b) => {
      if (!!a.favorited !== !!b.favorited) return a.favorited ? -1 : 1;
      const aTime = a.lastOpenedAt ? new Date(a.lastOpenedAt).getTime() : -Infinity;
      const bTime = b.lastOpenedAt ? new Date(b.lastOpenedAt).getTime() : -Infinity;
      return bTime - aTime;
    });
  const totalModules = visibleWorkspaces.reduce((sum, w) => sum + w.modules.length, 0);
  const allModules = visibleWorkspaces.flatMap((w) => w.modules);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const updatedToday = visibleWorkspaces.filter(
    (w) => w.lastActivityAt && new Date(w.lastActivityAt).getTime() >= todayStart.getTime()
  ).length;
  const taskModulesWithOpenTasks = allModules.filter(
    (m) => m.type === 'tasks' && (m.tasks ?? []).some((t) => !t.done)
  );
  const allTasks = allModules.filter((m) => m.type === 'tasks').flatMap((m) => m.tasks ?? []);
  const openTasks = allTasks.filter((t) => !t.done).length;
  const completedTasks = allTasks.filter((t) => t.done).length;
  const now = Date.now();
  const sevenDaysOut = now + 7 * 24 * 60 * 60 * 1000;
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const completedThisWeek = allTasks.filter(
    (t) => t.completedAt && new Date(t.completedAt).getTime() >= sevenDaysAgo
  ).length;
  const openTaskWorkspaceCount = new Set(
    visibleWorkspaces
      .filter((w) => w.modules.some((m) => taskModulesWithOpenTasks.includes(m)))
      .map((w) => w.id)
  ).size;
  const upcomingEvents = allModules
    .filter((m) => m.type === 'calendar')
    .flatMap((m) => m.events ?? [])
    .filter((e) => {
      const time = new Date(e.datetime).getTime();
      return time >= now && time <= sevenDaysOut;
    }).length;

  const stats = [
    {
      label: 'Workspaces',
      value: visibleWorkspaces.length,
      sub: updatedToday > 0 ? `${updatedToday} updated today` : null,
    },
    {
      label: 'Open Tasks',
      value: openTasks,
      sub: openTaskWorkspaceCount > 0
        ? `across ${openTaskWorkspaceCount} workspace${openTaskWorkspaceCount === 1 ? '' : 's'}`
        : null,
    },
    {
      label: 'Tasks Completed',
      value: completedTasks,
      sub: `${completedThisWeek} completed this week`,
    },
    { label: 'Upcoming Events', value: upcomingEvents, sub: 'next 7 days' },
  ];

  const openWorkspace = (id: string) => {
    setActiveWorkspace(id);
    setActiveView('workspace');
  };

  const handleNewWorkspace = () => {
    addWorkspace();
    setActiveView('workspace');
  };

  return (
    <div className="flex-1 overflow-auto mr-[-14px]">
      <div className="p-8 pb-6 pt-[28px] bg-white">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <p className="text-xs font-semibold text-text-gray">{DATE_LABEL}</p>
            <h1 className="mt-2 text-3xl font-semibold">
              {getGreeting()}, {profile.name || 'there'}
            </h1>
            <p className="mt-1 text-sm text-text-gray">
              You have {visibleWorkspaces.length} workspace{visibleWorkspaces.length === 1 ? '' : 's'} and {totalModules} modules across your project{totalModules === 1 ? '' : 's'}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNewWorkspace}
              style={{ backgroundColor: accentColor }}
              className="flex items-center cursor-pointer gap-2 rounded-md px-[14px] py-[9px] text-sm font-medium text-white hover:opacity-90"
            >
              <img src="/icons/add.svg" alt="" className="w-4" />
              New Workspace
            </button>
            <button
              type="button"
              disabled
              className="rounded-md border border-gray-200 px-[14px] py-[9px] text-sm font-medium opacity-50"
            >
              Browse Templates
            </button>
            <button
              type="button"
              disabled
              className="rounded-md border border-gray-200 px-[14px] py-[9px] text-sm font-medium opacity-50"
            >
              Import Data
            </button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border-subtle bg-secondary-gray p-4">
              <p className="text-2xl">{stat.value}</p>
              <p className="text-sm">{stat.label}</p>
              {stat.sub && <p className="mt-1 text-xs text-text-gray/70">{stat.sub}</p>}
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border-subtle p-8 pt-6">
        <h4 className="mb-[14px] font-semibold text-sm">Your Workspaces</h4>
        <div className="grid grid-cols-2 gap-4">
          {visibleWorkspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              accentColor={accentColor}
              onClick={() => openWorkspace(workspace.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
