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
  const updateModuleContent = useWorkspaceStore((state) => state.updateModuleContent);

  return (
    <div
      ref={ref}
      style={style}
      className={`flex flex-col border border-border-subtle shadow-subtle bg-white rounded-[12px] ${className ?? ''}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
      {...rest}
    >
      <div className="card-header items-center cursor-grab bg-secondary-gray border-b border-border-subtle flex p-[10px] rounded-t-[12px] text-text-gray uppercase">
        <div className="w-[21px]">
          <img src="/icons/drag.svg" alt="" draggable={false} />
        </div>
        <h3 className="text-xs">{module.type}</h3>
      </div>
      <p>
        Position: ({module.x}, {module.y}), Size: ({module.w} x {module.h})
      </p>
      {module.type === 'browser' && <p>browser panel</p>}
      {module.type === 'notes' && (
        <textarea
          value={module.content ?? ''}
          onChange={(e) => updateModuleContent(module.id, e.target.value)}
          placeholder="Write a note..."
          className="w-full flex-1 resize-none border-none p-0 outline-none"
        />
      )}
      {module.type === 'tasks' && <p>tasks</p>}
      <button type="button" onClick={() => removeModule(module.id)}>
        remove module
      </button>
      {children}
    </div>
  );
});

export default Module;
