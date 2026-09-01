import { forwardRef } from 'react';
import { useWorkspaceStore, WorkspaceModule } from '../store/workspaceGridStore';
import BrowserModule from './BrowserModule';

interface ModuleProps extends React.HTMLAttributes<HTMLDivElement> {
  module: WorkspaceModule;
}

const Module = forwardRef<HTMLDivElement, ModuleProps>(function Module(
  { module, style, className, onMouseDown, onMouseUp, onTouchEnd, children, ...rest },
  ref
) {
  const openModuleSettings = useWorkspaceStore((state) => state.openModuleSettings);
  const updateModuleContent = useWorkspaceStore((state) => state.updateModuleContent);
  const addTask = useWorkspaceStore((state) => state.addTask);
  const toggleTask = useWorkspaceStore((state) => state.toggleTask);
  const removeTask = useWorkspaceStore((state) => state.removeTask);

  const handleAddTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const value = e.currentTarget.value.trim();
    if (!value) return;
    addTask(module.id, value);
    e.currentTarget.value = '';
  };

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
      <div className="card-header items-center bg-secondary-gray border-b border-border-subtle flex py-[10px] px-[8px] rounded-t-[12px] text-text-gray uppercase">
        <div className="w-[21px] drag-target cursor-grab">
          <img src="/icons/drag.svg" alt="" draggable={false} />
        </div>
        <span
          className={`mx-1 bg-text-gray ${module.type === 'notes' ? 'w-3 h-3' : module.type === 'tasks' ? 'w-[14px] h-[14px]' : 'w-4 h-4'} [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]`}
          style={{ maskImage: `url(/icons/${module.type}.svg)` }}
        />
        <h3 className="text-xs">{module.type}</h3>
        <button className="ml-auto p-2 flex items-center cursor-pointer hover:bg-hover-gray rounded" onClick={() => openModuleSettings(module.id)}>
          <span className="inline-block w-[14px] h-[14px] bg-text-gray [mask-image:url('/icons/settings.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]" />
        </button>
      </div>
      {module.type === 'browser' && <BrowserModule module={module} />}
      {module.type === 'notes' && (
        <textarea
          value={module.content ?? ''}
          onChange={(e) => updateModuleContent(module.id, e.target.value)}
          placeholder="Write a note..."
          className="w-full flex-1 resize-none border-none p-2 outline-none"
        />
      )}
      {module.type === 'tasks' && (
        <div className="flex flex-1 flex-col overflow-auto p-2">
          <input
            type="text"
            onKeyDown={handleAddTask}
            placeholder="Add a task and press Enter"
            className="border-b border-border-subtle py-1 text-sm outline-none placeholder:text-text-gray"
          />
          <ul className="mt-2 flex flex-col gap-1">
            {(module.tasks ?? []).map((task) => (
              <li key={task.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(module.id, task.id)}
                />
                <span className={`flex-1 ${task.done ? 'text-text-gray line-through' : ''}`}>
                  {task.label}
                </span>
                <button className="cursor-pointer" type="button" onClick={() => removeTask(module.id, task.id)}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {children}
    </div>
  );
});

export default Module;
