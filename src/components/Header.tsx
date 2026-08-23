import { useWorkspaceStore } from '../store/workspaceGridStore';
const GRID_COLUMNS = 12;

export default function Header() {
  const modules = useWorkspaceStore((state) => state.modules);
  const addModule = useWorkspaceStore((state) => state.addModule);
  const handleAddModule = () => {
    const w = 4;
    const h = 4;
    const x = (modules.length * w) % GRID_COLUMNS;
    const y = modules.reduce((bottomEdge, module) => Math.max(bottomEdge, module.y + module.h), 0);

    addModule({
      id: crypto.randomUUID(),
      type: 'tasks',
      x,
      y,
      w,
      h,
    });
  };

  return (
    <div className="flex items-center sticky top-0 z-10 justify-between bg-white border-b border-border-subtle px-4 py-2 mr-[-14px]">
      <h1 className="text-lg font-semibold text-text-gray">Workspace</h1>
      <button
        onClick={handleAddModule}
        className="flex items-center gap-2 rounded-md bg-primary-purple px-[14px] py-[6px] text-sm font-medium text-white hover:bg-primary-purple/90"
      >
        <img src="/icons/add.svg" alt="" className="w-4" />
        Add Module
      </button>
    </div>
  );
}
