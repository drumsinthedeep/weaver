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

  const handleUrlSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const value = e.currentTarget.value.trim();
    if (!value) return;
    const url = /^https?:\/\//.test(value) ? value : `https://${value}`;
    updateModuleUrl(module.id, url);
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
      <div className="card-header items-center cursor-grab bg-secondary-gray border-b border-border-subtle flex py-[10px] px-[8px] rounded-t-[12px] text-text-gray uppercase">
        <div className="w-[21px]">
          <img src="/icons/drag.svg" alt="" draggable={false} />
        </div>
        <img src={`/icons/${module.type}.svg`} alt="" className={`mx-1 ${module.type === 'notes' ? 'w-3' : 'w-4'}`} draggable={false} />
        <h3 className="text-xs">{module.type}</h3>
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
      {module.type === 'tasks' && <p>tasks</p>}
      <button type="button" onClick={() => removeModule(module.id)}>
        remove module
      </button>
      {children}
    </div>
  );
});

export default Module;
