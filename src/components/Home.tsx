import { useWorkspaceStore } from '../store/workspaceGridStore';

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
  const totalModules = workspaces.reduce((sum, w) => sum + w.modules.length, 0);
  const allModules = workspaces.flatMap((w) => w.modules);
  const openTasks = allModules
    .filter((m) => m.type === 'tasks')
    .flatMap((m) => m.tasks ?? [])
    .filter((t) => !t.done).length;
  // const savedItems = allModules
  //   .filter((m) => m.type === 'bookmark')
  //   .flatMap((m) => m.tabs ?? []).length;

  const stats = [
    { label: 'Workspaces', value: workspaces.length },
    { label: 'Total Modules', value: totalModules },
    { label: 'Open Tasks', value: openTasks },
    { label: 'Saved Items', value: [] },
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
              You have {workspaces.length} workspace{workspaces.length === 1 ? '' : 's'} and {totalModules} modules across your project{totalModules === 1 ? '' : 's'}.
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
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="text-sm text-text-gray">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border-subtle p-8 pt-6">
        <h4 className="mb-[14px] font-semibold text-sm">Your Workspaces</h4>
        <div className="grid grid-cols-2 gap-4">
          {workspaces.map((workspace) => {
            const taskModules = workspace.modules.filter((m) => m.type === 'tasks');
            const allTasks = taskModules.flatMap((m) => m.tasks ?? []);
            const doneTasks = allTasks.filter((t) => t.done).length;

            return (
              <button
                key={workspace.id}
                type="button"
                onClick={() => openWorkspace(workspace.id)}
                className="cursor-pointer rounded-lg bg-white p-4 text-left shadow-subtle hover:shadow-xl transition-shadow"
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
          })}
        </div>
      </div>
    </div>
  );
}
