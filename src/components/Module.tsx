import { forwardRef, useRef } from 'react';
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
  const addBookmark = useWorkspaceStore((state) => state.addBookmark);
  const removeBookmark = useWorkspaceStore((state) => state.removeBookmark);
  const updateBookmarkTitle = useWorkspaceStore((state) => state.updateBookmarkTitle);
  const addFile = useWorkspaceStore((state) => state.addFile);
  const removeFile = useWorkspaceStore((state) => state.removeFile);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const isSharp = activeWorkspace?.moduleStyle === 'sharp';
  const accentColor = activeWorkspace?.accentColor ?? '#6366F1';

  const handleAddTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const value = e.currentTarget.value.trim();
    if (!value) return;
    addTask(module.id, value);
    e.currentTarget.value = '';
  };

  const bookmarkUrlInputRef = useRef<HTMLInputElement>(null);
  const bookmarkTagInputRef = useRef<HTMLInputElement>(null);

  const handleAddBookmark = () => {
    const value = bookmarkUrlInputRef.current?.value.trim();
    if (!value) return;
    const url = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    let title = url;
    try {
      title = new URL(url).hostname;
    } catch {
      // Not a valid URL once prefixed — fall back to showing the raw input as the title.
    }
    const tag = bookmarkTagInputRef.current?.value.trim() || undefined;
    const id = crypto.randomUUID();
    addBookmark(module.id, { id, url, title, tag });
    if (bookmarkUrlInputRef.current) bookmarkUrlInputRef.current.value = '';
    if (bookmarkTagInputRef.current) bookmarkTagInputRef.current.value = '';

    window.ipcRenderer.invoke('fetch-page-title', url).then((pageTitle: string | null) => {
      if (pageTitle) updateBookmarkTitle(module.id, id, pageTitle);
    });
  };

  const handleBookmarkInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddBookmark();
  };

  const openExternalUrl = (url: string) => {
    window.ipcRenderer.invoke('open-external', url);
  };

  const openPath = (path: string) => {
    window.ipcRenderer.invoke('open-path', path);
  };

  const handleSelectFiles = async () => {
    const files: { path: string; size: number }[] = await window.ipcRenderer.invoke('select-files');
    files.forEach(({ path, size }) => {
      const name = path.split(/[\\/]/).pop() || path;
      addFile(module.id, { id: crypto.randomUUID(), path, name, size, addedAt: new Date().toISOString() });
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const cardStyle: React.CSSProperties = {
    ...style,
    ...(module.color && { borderTopColor: module.color, borderTopWidth: '4px' }),
  };

  return (
    <div
      ref={ref}
      style={cardStyle}
      className={`flex flex-col border border-border-subtle shadow-subtle bg-white ${isSharp ? '' : 'rounded-[12px]'} ${className ?? ''}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
      {...rest}
    >
      <div
        className={`card-header items-center bg-secondary-gray border-b border-border-subtle flex py-[10px] px-[8px] ${
          isSharp ? '' : 'rounded-t-[12px]'
        } text-text-gray uppercase`}
      >
        <div className="w-[21px] drag-target cursor-grab">
          <img src="/icons/drag.svg" alt="" draggable={false} />
        </div>
        <span
          className={`mx-1 bg-text-gray ${module.type === 'notes' ? 'w-3 h-3' : module.type === 'tasks' ? 'w-[14px] h-[14px]' : 'w-4 h-4'} [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]`}
          style={{ maskImage: `url(/icons/${module.type === 'file' ? 'folder' : module.type}.svg)` }}
        />
        <h3 className="text-xs">{module.name || module.type}</h3>
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
          <div
            style={{ '--accent': accentColor } as React.CSSProperties}
            className="rounded-md border border-border-subtle px-2 transition-colors focus-within:border-[var(--accent)]"
          >
            <input
              type="text"
              onKeyDown={handleAddTask}
              placeholder="Add a task and press Enter"
              className="w-full py-1.5 text-sm outline-none placeholder:text-text-gray"
            />
          </div>
          <ul className="mt-2 flex flex-col gap-1">
            {(module.tasks ?? []).map((task) => (
              <li key={task.id} className="group flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  style={{ '--accent': accentColor } as React.CSSProperties}
                  className="cursor-pointer relative appearance-none w-[14px] h-[14px] border border-border-subtle rounded-sm checked:bg-[var(--accent)] checked:border-[var(--accent)] checked:after:content-[''] checked:after:absolute checked:after:inset-[2px] checked:after:bg-white checked:after:[mask-image:url('/icons/check.svg')] checked:after:[mask-repeat:no-repeat] checked:after:[mask-position:center] checked:after:[mask-size:contain]"
                  checked={task.done}
                  onChange={() => toggleTask(module.id, task.id)}
                />
                <span className={`flex-1 ${task.done ? 'text-text-gray line-through' : ''}`}>
                  {task.label}
                </span>
                <button
                  type="button"
                  onClick={() => removeTask(module.id, task.id)}
                  className="shrink-0 cursor-pointer rounded p-1 opacity-0 transition-opacity hover:bg-hover-gray group-hover:opacity-100"
                >
                  <span className="block h-3 w-3 bg-text-gray [mask-image:url('/icons/close.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {module.type === 'bookmark' && (
        <div className="flex flex-1 flex-col overflow-auto p-2">
          <div
            style={{ '--accent': accentColor } as React.CSSProperties}
            className="flex items-center gap-1 rounded-md border border-border-subtle px-2 transition-colors focus-within:border-[var(--accent)]"
          >
            <input
              type="text"
              ref={bookmarkUrlInputRef}
              onKeyDown={handleBookmarkInputKeyDown}
              placeholder="Paste a URL and press Enter"
              className="flex-1 py-1.5 text-sm outline-none placeholder:text-text-gray"
            />
            <input
              type="text"
              ref={bookmarkTagInputRef}
              onKeyDown={handleBookmarkInputKeyDown}
              placeholder="Tag"
              className="w-16 border-l border-border-subtle py-1.5 pl-2 text-sm outline-none placeholder:text-text-gray"
            />
          </div>
          <ul className="mt-2 flex flex-col gap-1">
            {(module.bookmarks ?? []).map((bookmark) => {
              let hostname: string | null = null;
              try {
                hostname = new URL(bookmark.url).hostname;
              } catch {
                // Leave hostname null — falls back to the generic bookmark glyph below.
              }

              return (
                <li key={bookmark.id} className="group flex items-center gap-2 text-sm">
                  {hostname ? (
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
                      alt=""
                      className="h-[14px] w-[14px] shrink-0 rounded-sm"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/icons/bookmark.svg';
                      }}
                    />
                  ) : (
                    <span className="h-[14px] w-[14px] shrink-0 bg-text-gray [mask-image:url('/icons/bookmark.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]" />
                  )}
                  <span
                    title={bookmark.url}
                    onClick={() => openExternalUrl(bookmark.url)}
                    className="min-w-0 flex-1 truncate cursor-pointer hover:underline"
                  >
                    {bookmark.title}
                  </span>
                  {bookmark.tag && (
                    <span className="shrink-0 rounded-full bg-hover-gray px-2 py-0.5 text-xs text-text-gray">
                      {bookmark.tag}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeBookmark(module.id, bookmark.id)}
                    className="shrink-0 cursor-pointer rounded p-1 opacity-0 transition-opacity hover:bg-hover-gray group-hover:opacity-100"
                  >
                    <span className="block h-3 w-3 bg-text-gray [mask-image:url('/icons/close.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {module.type === 'file' && (
        <div className="flex flex-1 flex-col overflow-auto p-2">
          <button
            type="button"
            onClick={handleSelectFiles}
            style={{ '--accent': accentColor } as React.CSSProperties}
            className="group flex items-center justify-center gap-2 rounded-md border border-dashed border-border-subtle py-2 text-sm text-text-gray transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer"
          >
            <span className="h-4 w-4 bg-text-gray [mask-image:url('/icons/add.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] group-hover:bg-[var(--accent)]" />
            Add Files
          </button>
          <ul className="mt-2 flex flex-col gap-1">
            {(module.files ?? []).map((file) => (
              <li key={file.id} className="group flex items-center gap-2 text-sm">
                <span className="h-[18px] w-[18px] shrink-0 bg-text-gray [mask-image:url('/icons/folder.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]" />
                <span
                  title={file.path}
                  onClick={() => openPath(file.path)}
                  className="min-w-0 flex-1 truncate cursor-pointer hover:underline"
                >
                  {file.name}
                </span>
                <span className="shrink-0 text-xs text-text-gray">{formatFileSize(file.size)}</span>
                <span className="shrink-0 text-xs text-text-gray">
                  {new Date(file.addedAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(module.id, file.id)}
                  className="shrink-0 cursor-pointer rounded p-1 opacity-0 transition-opacity hover:bg-hover-gray group-hover:opacity-100"
                >
                  <span className="block h-3 w-3 bg-text-gray [mask-image:url('/icons/close.svg')] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]" />
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
