import { useWorkspaceStore, WorkspaceModule } from '../store/workspaceGridStore';
import Module from './Module';

const GRID_COLUMNS = 12;

function findNextPosition(modules: WorkspaceModule[], w: number) {
  const rowRightEdges = new Map<number, number>();
  modules.forEach((module) => {
    const rightEdge = module.x + module.w;
    rowRightEdges.set(module.y, Math.max(rowRightEdges.get(module.y) ?? 0, rightEdge));
  });

  const rowWithSpace = [...rowRightEdges.entries()]
    .sort(([rowA], [rowB]) => rowA - rowB)
    .find(([, rightEdge]) => rightEdge + w <= GRID_COLUMNS);

  if (rowWithSpace) {
    const [y, x] = rowWithSpace;
    return { x, y };
  }

  const nextY = modules.reduce((bottomEdge, module) => Math.max(bottomEdge, module.y + module.h), 0);
  return { x: 0, y: nextY };
}

function WorkspaceGrid(): React.JSX.Element {
  const modules = useWorkspaceStore((state) => state.modules);
  const addModule = useWorkspaceStore((state) => state.addModule);

  const handleAddModule = () => {
    const w = 4;
    const h = 4;
    const { x, y } = findNextPosition(modules, w);

    addModule({
      id: crypto.randomUUID(),
      type: 'browser',
      x,
      y,
      w,
      h,
    });
  };

  return (
    <div>
      <div className="workspace-grid grid grid-cols-12 auto-rows-[80px] gap-1">
        {modules.map((module) => (
          <Module key={module.id} module={module} />
        ))}
      </div>
      <button type="button" onClick={handleAddModule}>
        add module
      </button>
    </div>
  );
}

export default WorkspaceGrid;
