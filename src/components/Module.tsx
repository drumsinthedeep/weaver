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
  const updateModuleUrl = useWorkspaceStore((state) => state.updateModuleUrl);
  const addTask = useWorkspaceStore((state) => state.addTask);
  const toggleTask = useWorkspaceStore((state) => state.toggleTask);
  const removeTask = useWorkspaceStore((state) => state.removeTask);

  const handleUrlSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const value = e.currentTarget.value.trim();
    if (!value) return;
    const url = /^https?:\/\//.test(value) ? value : `https://${value}`;
    updateModuleUrl(module.id, url);
  };

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
        <button className="ml-auto flex items-center cursor-pointer">
          <span className="mr-2 inline-block w-[14px] h-[14px] bg-text-gray [mask-image:url('/icons/settings.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]" />
        </button>
      </div>
      {module.type === 'browser' && (
        <div className="flex flex-1 flex-col">
          <input
            type="text"
            defaultValue={module.url ?? ''}
            onKeyDown={handleUrlSubmit}
            placeholder="Enter a URL and press Enter"
            className="border-b border-border-subtle p-1 text-sm outline-none"
          />
          {module.url ? (
            <webview src={module.url} className="flex-1" />
          ) : (
            <p className="flex-1 p-2 text-sm text-text-gray">Enter a URL above to browse</p>
          )}
        </div>
      )}
      {module.type === 'notes' && (
        <textarea
          value={module.content ?? ''}
          onChange={(e) => updateModuleContent(module.id, e.target.value)}
          placeholder="Write a note..."
          className="w-full flex-1 resize-none border-none p-0 outline-none"
        />
      )}
      {module.type === 'tasks' && (
        <div className="flex flex-1 flex-col overflow-auto p-2">
          <input
            type="text"
            onKeyDown={handleAddTask}
            placeholder="Add a task and press Enter"
            className="border-b border-border-subtle p-1 text-sm outline-none"
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
                <button type="button" onClick={() => removeTask(module.id, task.id)}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button type="button" onClick={() => removeModule(module.id)}>
        remove module
      </button>
      {children}
    </div>
  );
});

export default Module;
