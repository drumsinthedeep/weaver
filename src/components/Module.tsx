import { useWorkspaceStore, WorkspaceModule } from '../store/workspaceGridStore';

function Module({ module }: { module: WorkspaceModule }): React.JSX.Element {
  const removeModule = useWorkspaceStore((state) => state.removeModule);
  const resizeModule = useWorkspaceStore((state) => state.resizeModule);

  const style = {
    gridColumn: `${module.x + 1} / span ${module.w}`,
    gridRow: `${module.y + 1} / span ${module.h}`,
  };

  const handleResizeStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();

    const grid = e.currentTarget.closest<HTMLElement>('.workspace-grid');
    if (!grid) return;

    const gridStyle = getComputedStyle(grid);
    const colWidth = parseFloat(gridStyle.gridTemplateColumns.split(' ')[0]);
    const rowHeight = parseFloat(gridStyle.gridTemplateRows.split(' ')[0]);
    const colStep = colWidth + parseFloat(gridStyle.columnGap);
    const rowStep = rowHeight + parseFloat(gridStyle.rowGap);

    grid.style.setProperty('--col-step', `${colStep}px`);
    grid.style.setProperty('--row-step', `${rowStep}px`);
    grid.classList.add('resizing');

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = module.w;
    const startH = module.h;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaCols = Math.round((moveEvent.clientX - startX) / colStep);
      const deltaRows = Math.round((moveEvent.clientY - startY) / rowStep);
      resizeModule(module.id, startW + deltaCols, startH + deltaRows);
    };

    const handlePointerUp = () => {
      grid.classList.remove('resizing');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <div style={style} className="relative border border-gray-300">
      <h2>{module.type}</h2>
      <p>
        Position: ({module.x}, {module.y}), Size: ({module.w} x {module.h})
      </p>
      {module.type === 'browser' && <p>browser panel</p>}
      {module.type === 'notes' && <p>notes</p>}
      {module.type === 'tasks' && <p>tasks</p>}
      <button type="button" onClick={() => removeModule(module.id)}>
        remove module
      </button>
      <div
        onPointerDown={handleResizeStart}
        className="absolute bottom-0 right-0 h-3 w-3 cursor-nwse-resize bg-gray-400"
      />
    </div>
  );
}

export default Module;
