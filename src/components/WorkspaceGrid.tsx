import ReactGridLayout, { useContainerWidth, Layout } from 'react-grid-layout';
import { useWorkspaceStore } from '../store/workspaceGridStore';
import Module from './Module';
import Header from './Header';

const GRID_COLUMNS = 12;

function WorkspaceGrid(): React.JSX.Element {
  const modules = useWorkspaceStore((state) => state.modules);
  const addModule = useWorkspaceStore((state) => state.addModule);
  const setModules = useWorkspaceStore((state) => state.setModules);
  const { width, containerRef, mounted } = useContainerWidth();

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

  const handleLayoutChange = (layout: Layout) => {
    const changed = layout.some((item) => {
      const module = modules.find((m) => m.id === item.i);
      return (
        !module ||
        module.x !== item.x ||
        module.y !== item.y ||
        module.w !== item.w ||
        module.h !== item.h
      );
    });
    if (!changed) return;

    const next = modules.map((module) => {
      const item = layout.find((l) => l.i === module.id);
      return item ? { ...module, x: item.x, y: item.y, w: item.w, h: item.h } : module;
    });
    setModules(next);
  };

  const layout: Layout = modules.map((module) => ({
    i: module.id,
    x: module.x,
    y: module.y,
    w: module.w,
    h: module.h,
  }));

  return (
    <div>
      <Header onAddModule={handleAddModule} />
      <div ref={containerRef as React.RefObject<HTMLDivElement>} className="bg-primary-gray mt-3">
        {mounted && (
          <ReactGridLayout
            layout={layout}
            width={width}
            gridConfig={{ rowHeight: 80 }}
            resizeConfig={{
              handleComponent: (_axis, ref) => (
                <div
                  ref={ref as React.RefObject<HTMLDivElement>}
                  className="absolute bottom-0 right-0 h-4 w-4 resize-handle m-1"
                >
                  <img src="/icons/resize.svg" alt="" className="w-full" />
                </div>
              ),
            }}
            dragConfig={{ cancel: 'textarea', handle: '.card-header' }}
            onLayoutChange={handleLayoutChange}
          >
            {modules.map((module) => (
              <Module key={module.id} module={module} />
            ))}
          </ReactGridLayout>
        )}
      </div>
    </div>
  );
}

export default WorkspaceGrid;
