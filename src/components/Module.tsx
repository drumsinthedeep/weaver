import { forwardRef } from 'react';
import { useWorkspaceStore, WorkspaceModule } from '../store/workspaceGridStore';

interface ModuleProps extends React.HTMLAttributes<HTMLDivElement> {
  module: WorkspaceModule;
}

const Module = forwardRef<HTMLDivElement, ModuleProps>(function Module(
  { module, style, className, onMouseDown, onMouseUp, onTouchEnd, children, ...rest },
  ref
) {
  const removeModule = useWorkspaceStore((state) => state.removeModule);

  return (
    <div
      ref={ref}
      style={style}
      className={`border border-gray-300 bg-white p-2 ${className ?? ''}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
      {...rest}
    >
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
      {children}
    </div>
  );
});

export default Module;
