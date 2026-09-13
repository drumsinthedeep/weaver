import ReactGridLayout, { useContainerWidth, Layout } from 'react-grid-layout';
import { useWorkspaceStore, useActiveWorkspaceModules, BACKGROUND_TINT_COLORS } from '../store/workspaceGridStore';
import Module from './Module';

function WorkspaceGrid(): React.JSX.Element {
  const modules = useActiveWorkspaceModules();
  const setModules = useWorkspaceStore((state) => state.setModules);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const backgroundTint = workspaces.find((w) => w.id === activeWorkspaceId)?.backgroundTint ?? 'default';
  const { width, containerRef, mounted } = useContainerWidth();

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
    static: module.locked,
  }));

  return (
    <div>
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        style={{ backgroundColor: BACKGROUND_TINT_COLORS[backgroundTint] }}
        className="h-screen mr-[-14px]"
      >
        {mounted && (
          <ReactGridLayout
            layout={layout}
            width={width}
            gridConfig={{ rowHeight: 80 }}
            resizeConfig={{
              handleComponent: (_axis, ref) => (
                <div
                  ref={ref as React.RefObject<HTMLDivElement>}
                  className="absolute bottom-0 right-0 h-4 w-4 resize-handle m-1 cursor-pointer"
                >
                  <img src="/icons/resize.svg" alt="" className="w-full" />
                </div>
              ),
            }}
            dragConfig={{ cancel: 'textarea', handle: '.drag-target' }}
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
